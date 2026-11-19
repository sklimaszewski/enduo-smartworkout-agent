import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { loadConfig } from '../src/config.ts';
import { Enduo, EnduoAuthError, EnduoError, EnduoToolError } from '../src/enduo.ts';

type Answer = (id: number) => { status?: number; body: unknown };

/** An MCP server in place of fetch: it opens a session and answers tools/call with what the test gives. */
function server(answer: Answer): { calls: string[] } {
  const calls: string[] = [];
  mock.method(globalThis, 'fetch', async (_url: string, init: { body: string }) => {
    const message = JSON.parse(init.body) as { id?: number; method: string; params?: { name?: string } };
    if (message.method === 'initialize') {
      return Response.json({ jsonrpc: '2.0', id: message.id, result: {} }, { headers: { 'mcp-session-id': 'session-1' } });
    }
    if (message.method !== 'tools/call') {
      return new Response(null, { status: 202 });
    }
    calls.push(String(message.params?.name));
    const { status = 200, body } = answer(message.id ?? 0);

    return typeof body === 'string' ? new Response(body, { status }) : Response.json(body, { status });
  });

  return { calls };
}

const toolError = (text: string): Answer => (id) => ({ body: { jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text }] } } });

let tokens = 0;
const enduo = (): Enduo => new Enduo(loadConfig({ ENDUO_URL: 'https://api.enduo.test' }), `token-${++tokens}`);

describe('Enduo', () => {
  afterEach(() => mock.restoreAll());

  it('returns what a tool returned', async () => {
    server((id) => ({ body: { jsonrpc: '2.0', id, result: { structuredContent: { activity_id: 'a-1' } } } }));

    assert.deepEqual(await enduo().callTool('strength_session_log', {}), { activity_id: 'a-1' });
  });

  it('reports input Enduo refuses as invalid as a refusal of this record', async () => {
    server(toolError('Invalid input. sets[0].reps: This value should be between 0 and 1000.'));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoToolError);

    server((id) => ({
      body: { jsonrpc: '2.0', id, error: { code: -32602, message: "Invalid parameters for tool 'strength_session_log': sets", data: { validation_errors: [{}] } } },
    }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoToolError);

    server((id) => ({ status: 400, body: { jsonrpc: '2.0', id, error: { code: -32602, message: 'Invalid parameters', data: { validation_errors: [{}] } } } }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoToolError);

    server(() => ({ status: 422, body: 'Unprocessable' }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoToolError);
  });

  it('reports a token without the scope as a sign-in problem, not as a bad record', async () => {
    server(toolError('Access denied. The token lacks the "write:strength" scope.'));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoAuthError);

    for (const status of [401, 403]) {
      server(() => ({ status, body: 'no' }));
      await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoAuthError);
    }
  });

  it('reports everything that is not about the record as a failure to try again', async () => {
    for (const status of [400, 429, 500, 503]) {
      server(() => ({ status, body: 'later' }));
      await assert.rejects(enduo().callTool('strength_session_log', {}), (error) => error instanceof EnduoError && !(error instanceof EnduoToolError));
    }

    // "Invalid params" without validation errors is an unknown tool, a protocol error: no record is at fault.
    server((id) => ({ body: { jsonrpc: '2.0', id, error: { code: -32602, message: 'Tool not found' } } }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoError);

    server((id) => ({ body: { jsonrpc: '2.0', id, error: { code: -32603, message: 'Error while executing tool' } } }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoError);

    server(() => ({ body: 'not json' }));
    await assert.rejects(enduo().callTool('strength_session_log', {}), EnduoError);
  });

  it('asks once per token which account it belongs to', async () => {
    const { calls } = server((id) => ({ body: { jsonrpc: '2.0', id, result: { structuredContent: { user: { id: 'account-a', email: 'me@example.com' } } } } }));
    const config = loadConfig({ ENDUO_URL: 'https://api.enduo.test' });

    assert.equal(await new Enduo(config, 'token-of-a').account(), 'account-a');
    assert.equal(await new Enduo(config, 'token-of-a').account(), 'account-a');
    assert.deepEqual(calls, ['whoami']);

    server((id) => ({ body: { jsonrpc: '2.0', id, result: { structuredContent: { scopes: [] } } } }));
    await assert.rejects(new Enduo(config, 'token-of-nobody').account(), EnduoError);
  });
});
