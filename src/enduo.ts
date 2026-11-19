// Enduo: signing in with a code (device flow, RFC 8628) and calling MCP tools (Streamable HTTP, JSON-RPC 2.0).
// The container asks only for "write:strength", so it never takes the place of the coach container
// (which holds "agent:runtime").

import { spawnSync } from 'node:child_process';

import { ENDUO_SCOPES } from './config.ts';
import type { Config } from './config.ts';
import { sha256 } from './identity.ts';
import type { Store } from './store.ts';
import { line } from './text.ts';

const PROTOCOL_VERSION = '2025-06-18';
const DEVICE_GRANT = 'urn:ietf:params:oauth:grant-type:device_code';

/** The token is missing, revoked or lacks the scope: only a new sign-in helps. */
export class EnduoAuthError extends Error {}
/** Enduo refused what was sent as invalid: sending the same again will not help, and the next record may be fine. */
export class EnduoToolError extends Error {}
/** Network, 429, 5xx, a protocol hiccup: nothing about one record; try again later. */
export class EnduoError extends Error {}

/** JSON-RPC "invalid params": with `validation_errors`, the arguments of a tool call did not fit its schema. */
const INVALID_PARAMS = -32602;

export type LoginResult = 'signed_in' | 'denied' | 'expired';

interface JsonRpcError {
  code?: number;
  message?: string;
  data?: unknown;
}

interface JsonRpcAnswer {
  id?: number;
  result?: unknown;
  error?: JsonRpcError;
}

/** Enduo's own words in a log line or an error: one line, bounded. */
const said = (text: unknown): string => line(text, 300) ?? '';

/** The arguments of the call did not fit the schema of the tool: about this record, not about the connection. */
const refusedArguments = (error: JsonRpcError): boolean =>
  error.code === INVALID_PARAMS && typeof error.data === 'object' && error.data !== null && 'validation_errors' in error.data;

interface ToolResult {
  isError?: boolean;
  structuredContent?: unknown;
  content?: Array<{ type?: string; text?: string }>;
}

const sleep = (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

function qr(text: string): string {
  const result = spawnSync('qrencode', ['-t', 'ANSIUTF8', '-m', '1', text], { encoding: 'utf8' });

  return result.status === 0 ? result.stdout : '';
}

async function postForm(config: Config, path: string, fields: Record<string, string>): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await fetch(`${config.enduoUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': config.userAgent },
    body: new URLSearchParams(fields),
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    // the status says enough
  }

  return { status: response.status, body };
}

/** Shows a link and a code, waits until the athlete approves it in Enduo, and stores the token. */
export async function deviceLogin(config: Config, store: Store, print: (text: string) => void = console.log): Promise<LoginResult> {
  const started = await postForm(config, '/oauth/device/code', { client_name: config.name, scope: ENDUO_SCOPES });
  if (started.status !== 200) {
    throw new Error(`Enduo refused to start the sign-in (${started.status} ${String(started.body.error ?? '')}: ${String(started.body.error_description ?? '')})`);
  }

  const link = String(started.body.verification_uri_complete);
  print(
    [
      '',
      '──────────────────────────────────────────────────────────────',
      ' Sign this container in to Enduo:',
      '',
      `   open   ${link}`,
      `   or go  ${String(started.body.verification_uri)}  and enter  ${String(started.body.user_code)}`,
      '',
      qr(link),
      ` The code is valid for ${Math.round(Number(started.body.expires_in ?? 600) / 60)} minutes.`,
      '──────────────────────────────────────────────────────────────',
      '',
    ].join('\n'),
  );

  let interval = Number(started.body.interval ?? 5) || 5;
  for (;;) {
    await sleep(interval);
    const polled = await postForm(config, '/oauth/device/token', { grant_type: DEVICE_GRANT, device_code: String(started.body.device_code) });
    if (polled.status === 200 && typeof polled.body.access_token === 'string') {
      store.saveEnduo({
        accessToken: polled.body.access_token,
        tokenId: typeof polled.body.token_id === 'string' ? polled.body.token_id : undefined,
        scope: typeof polled.body.scope === 'string' ? polled.body.scope : undefined,
        enduoUrl: config.enduoUrl,
        signedInAt: new Date().toISOString(),
      });

      return 'signed_in';
    }
    switch (polled.body.error) {
      case 'authorization_pending':
        continue;
      case 'slow_down':
        interval += 5;
        continue;
      case 'access_denied':
        return 'denied';
      case 'expired_token':
        return 'expired';
      default:
        throw new Error(`Enduo answered ${polled.status} ${String(polled.body.error ?? '')}: ${String(polled.body.error_description ?? '')}`);
    }
  }
}

/** ENDUO_TOKEN wins over the stored sign-in. */
export function enduoToken(store: Store, env: NodeJS.ProcessEnv = process.env): string | null {
  const fromEnv = (env.ENDUO_TOKEN ?? '').trim();

  return fromEnv !== '' ? fromEnv : (store.enduo()?.accessToken ?? null);
}

/** One MCP session, opened on the first call and opened again when the server forgets it. */
export class Enduo {
  /** Account ids already asked for, by server and token: a token never changes its account. */
  private static readonly accounts = new Map<string, string>();

  private readonly config: Config;
  private readonly token: string;
  private sessionId: string | null = null;
  private nextId = 1;

  constructor(config: Config, token: string) {
    this.config = config;
    this.token = token;
  }

  private async send(message: Record<string, unknown>): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      'User-Agent': this.config.userAgent,
    };
    if (this.sessionId !== null) {
      headers['Mcp-Session-Id'] = this.sessionId;
      headers['Mcp-Protocol-Version'] = PROTOCOL_VERSION;
    }
    try {
      return await fetch(this.config.mcpUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
        redirect: 'error',
        signal: AbortSignal.timeout(120_000),
      });
    } catch (error) {
      throw new EnduoError(`Enduo is not reachable: ${(error as Error).message}`, { cause: error });
    }
  }

  /**
   * The answer to request `id`. `call` says the request was a tool call, the only one that carries a record:
   * only then can an answer mean "this record is invalid" (EnduoToolError) instead of "try again later".
   */
  private async answer(response: Response, id: number, call = false): Promise<unknown> {
    const text = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw new EnduoAuthError(`Enduo refused the token (${response.status}): run \`enduo-smartworkout setup --enduo\`.`);
    }

    const messages: JsonRpcAnswer[] = [];
    try {
      if ((response.headers.get('content-type') ?? '').includes('text/event-stream')) {
        for (const event of text.split(/\r?\n\r?\n/)) {
          const data = event
            .split(/\r?\n/)
            .filter((row) => row.startsWith('data:'))
            .map((row) => row.slice(5).trimStart())
            .join('\n');
          if (data) {
            messages.push(JSON.parse(data) as JsonRpcAnswer);
          }
        }
      } else if (text.trim()) {
        const parsed = JSON.parse(text) as JsonRpcAnswer | JsonRpcAnswer[];
        messages.push(...(Array.isArray(parsed) ? parsed : [parsed]));
      }
    } catch (error) {
      if (response.ok) {
        throw new EnduoError(`Enduo MCP sent an answer that cannot be read (${response.status})`, { cause: error });
      }
    }

    const answer = messages.find((message) => message?.id === id);
    if (call && answer?.error && refusedArguments(answer.error)) {
      throw new EnduoToolError(said(answer.error.message) || 'the arguments do not fit the tool');
    }
    if (call && response.status === 422) {
      throw new EnduoToolError(said(answer?.error?.message) || 'Enduo answered 422');
    }
    if (!response.ok) {
      throw new EnduoError(`Enduo MCP answered ${response.status}: ${said(text)}`);
    }
    if (!answer) {
      throw new EnduoError(`Enduo MCP sent no answer to request ${id}`);
    }
    if (answer.error) {
      throw new EnduoError(`Enduo MCP error ${answer.error.code}: ${said(answer.error.message)}`);
    }

    return answer.result;
  }

  private async open(): Promise<void> {
    this.sessionId = null;
    const id = this.nextId++;
    const response = await this.send({
      jsonrpc: '2.0',
      id,
      method: 'initialize',
      params: { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'enduo-smartworkout-agent', version: this.config.version } },
    });
    await this.answer(response, id);
    this.sessionId = response.headers.get('mcp-session-id');
    await this.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  }

  /** Calls a tool and returns what it returned (the decoded JSON text, or the structured content). */
  async callTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (this.sessionId === null) {
      await this.open();
    }

    const call = async (): Promise<Response> => this.send({ jsonrpc: '2.0', id: this.nextId, method: 'tools/call', params: { name, arguments: args } });
    let response = await call();
    if (response.status === 404 && this.sessionId !== null) {
      // The server forgot the session: open a new one and try once more.
      await this.open();
      response = await call();
    }
    const result = ((await this.answer(response, this.nextId++, true)) ?? {}) as ToolResult;

    const text = result.content?.find((part) => part.type === 'text' || part.text !== undefined)?.text ?? '';
    if (result.isError) {
      if (/^Access denied\b/.test(text)) {
        // The token lacks the scope (or the account its athlete): no record is at fault, and none may be given up on.
        throw new EnduoAuthError(`Enduo refused the token for ${name} (${said(text)}): run \`enduo-smartworkout setup --enduo\`.`);
      }
      throw new EnduoToolError(said(text) || `${name} failed`);
    }
    if (result.structuredContent !== undefined) {
      return result.structuredContent;
    }
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  /** Id of the Enduo account the token belongs to (`whoami`, which any token may call); asked once per token. */
  async account(): Promise<string> {
    const key = sha256(`${this.config.mcpUrl}\n${this.token}`);
    const known = Enduo.accounts.get(key);
    if (known !== undefined) {
      return known;
    }

    const me = (await this.callTool('whoami')) as { user?: { id?: unknown } } | null;
    const id = typeof me === 'object' && me !== null ? me.user?.id : undefined;
    if (typeof id !== 'string' || id === '') {
      throw new EnduoError('Enduo did not say which account the token belongs to.');
    }
    Enduo.accounts.set(key, id);

    return id;
  }
}
