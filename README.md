# Enduo SmartWorkout Agent

An **unofficial** agent for [Enduo](https://enduo.app) that connects [SmartWorkout](https://apps.apple.com/app/id1510802814)
with Enduo: the strength workouts you finish in SmartWorkout, every set with its exercise, reps and weight (or
duration), land on the activity your watch recorded, through Enduo's MCP tool `strength_session_log`.
With `STRAVA_ENABLED=true`, it also uploads new workouts to Strava as **Weight Training**, including native
exercise sets, repetitions, weights and timed sets.

```
 SmartWorkout (iPhone) ──► api.smartworkout.app ◄── this container ──► Enduo MCP: strength_session_log
                                                    every POLL_SECONDS
```

- The container only connects **out**. No port is opened.
- It reads SmartWorkout and never writes there: its sync calls carry no changes.
- It asks Enduo only for the `write:strength` scope, so it does not take the place of the coach container
  ([enduo-app/enduo-agent](https://github.com/enduo-app/enduo-agent)).

> [!IMPORTANT]
> **Unofficial.** This agent is not part of the Enduo service and comes without support or guarantees. It is not
> affiliated with, endorsed by or supported by SmartWorkout or its developer. SmartWorkout has no public API: what
> this uses was worked out from the app's own traffic ([docs/smartworkout-api.md](docs/smartworkout-api.md)), may
> break with any app update, and may not be allowed by SmartWorkout's terms of use. Use it with your own account
> only, and at your own risk. SmartWorkout is a trademark of its owner.

## Quick start

With [compose.yaml](compose.yaml) from this repository:

```bash
docker compose up -d
docker compose exec -it smartworkout enduo-smartworkout setup
```

The image is `sklimaszewski/enduo-smartworkout-agent` on Docker Hub (`linux/amd64` and `linux/arm64`); `docker compose build`
builds it from the checkout instead. The container starts and waits until `setup` is done; it picks up the sign-ins
within 15 seconds.

### `enduo-smartworkout setup`

1. **SmartWorkout.** SmartWorkout signs in only with Google or Apple, which a container cannot do. Setup asks for
   the session of the app instead: its access token and refresh token (below,
   [Getting the SmartWorkout session](#getting-the-smartworkout-session)). They can also come once from
   `SMARTWORKOUT_ACCESS_TOKEN` and `SMARTWORKOUT_REFRESH_TOKEN`. The access token lasts 14 days and is refreshed
   automatically a week before its end. **Signing out in the SmartWorkout app ends this session too**; then run
   `enduo-smartworkout setup --smartworkout` with a new one.
2. **Enduo.** It shows a link, a code and a QR code. Open the link, sign in to Enduo, choose how long the token stays
   valid and approve with your Enduo password; Enduo confirms the approval by e-mail. The container
   gets a personal access token with the `write:strength` scope, which you can revoke in Enduo at any time.
   Resetting your Enduo password revokes it too: sign the container in again afterwards.
   Instead, `ENDUO_TOKEN` can hold a personal access token with that scope.

Run `setup` again whenever something is off: it skips what already works.

### Getting the SmartWorkout session

The agent shares the session of the SmartWorkout app on your phone. You read it once from the app's own traffic,
with an intercepting proxy such as [mitmproxy](https://mitmproxy.org) on a computer in the same network:

1. Start `mitmweb` on the computer and set the phone's Wi-Fi proxy to the computer's address, port `8080`.
2. On the phone open `http://mitm.it`, install the mitmproxy profile and trust its certificate
   (Settings → General → About → Certificate Trust Settings).
3. In SmartWorkout sign out and sign in again. In mitmweb, the answer of
   `POST https://api.smartworkout.app/Account/auth/google` (or `…/apple`) holds `token.token` (the access token)
   and `token.refreshToken` (the refresh token).
4. Turn the proxy off, and delete the mitmproxy profile from the phone.

Treat both tokens like a password: they give full access to your SmartWorkout account. **Do not sign out in the
app afterwards**: signing out revokes the refresh token, and the agent then needs a new session
(`enduo-smartworkout setup --smartworkout`).

## What it sends

- **When:** every `POLL_SECONDS` (default 300) it asks SmartWorkout for the changes of the workout history since
  the last pass. A workout appears there when you finish it in the app.
- **First run:** workouts that started in the last `BACKFILL_DAYS` (default 90) are sent; older ones are skipped.
  SmartWorkout's change log does not reach far back (August 2026 on the account this was built with), and older
  workouts cannot be read. Enduo starts the coach's analysis only for a session that
  started in the last 24 hours, so filling in the history does not set off an analysis per workout.
- **Edited workout:** sent again; `strength_session_log` replaces the sets it sent before.
- **Deleted workout:** nothing happens in Enduo.
- **Matching:** Enduo puts the sets onto the strength activity of the watch that started within 30 minutes of the
  workout, else adds a new strength activity that the watch's copy joins later.

| SmartWorkout | `strength_session_log` |
|---|---|
| `startedAt`, `durationInMinutes` | `started_at`, `duration_s` |
| `name`, `notes` | `title`, `note_md` |
| exercise name from the catalogue, in `EXERCISE_LANGUAGE` | `sets[].exercise` |
| `reps`; for a timed exercise the milliseconds in `reps` | `sets[].reps`; `sets[].duration_s` |
| `weight` (assistance of an assisted exercise goes to the note) | `sets[].weight_kg` |
| `rpe` | `sets[].rir` = 10 − RPE |
| warm-up set type | `sets[].is_warmup` |
| workout id and server revision | `idempotency_key` |

Names and notes are text you (or SmartWorkout) wrote, and the coach in Enduo, a language model, reads them later.
Before they are sent, control and invisible characters are removed, whitespace is collapsed and the text is cut to
what a name or a note needs, with `…` at the cut: 120 characters for the title of a workout and the name of an
exercise, 300 for the note of an exercise (500 for a set's whole note), 2000 for the note of a workout.

### When something goes wrong

- **A workout that cannot be read, or that Enduo refuses as invalid,** is skipped and the pass goes on with the
  next one. The log names the workout by its id and says why, never what is in it; the pass ends with
  `Pass done: 3 sent, 1 skipped (unreadable or refused by Enduo), 0 with nothing to send`, and
  `enduo-smartworkout status` counts the skipped ones. A skipped workout is tried again when it changes in
  SmartWorkout (edit and save it), not on every pass.
- **Everything else** (the network, SmartWorkout or Enduo answering 429 or 5xx, a token Enduo no longer takes or
  that lacks the scope) ends the pass without giving up on anything. The next pass starts where this one did;
  after `Signed out` run `enduo-smartworkout setup`.

### Exercise names

SmartWorkout's server names its exercise catalogue in English only, whatever the language of the app; the app does
not download names in other languages. An exercise you added yourself is named in the language the app was in when
you added it, and has no English name. `EXERCISE_LANGUAGE` picks the name from what the catalogue has: the first
language of the list the exercise has a name in, else English, else whatever name it has. With the catalogue as it
is today, the agent therefore sends English names for SmartWorkout's exercises and your own names for yours,
whatever `EXERCISE_LANGUAGE` says; the setting takes effect for every exercise SmartWorkout gives a name in that
language. To have your own exercises in English as well, rename them in the app.

### Optional Strava export

Strava export is off by default. To enable it:

1. Register your own application in [Strava's API settings](https://www.strava.com/settings/api), with
   **Authorization Callback Domain** set to `localhost`.
2. Add its credentials and the flag to `.env`:

   ```dotenv
   STRAVA_ENABLED=true
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   STRAVA_TIMEZONE=Europe/Warsaw
   ```

3. Recreate the service so it receives the new environment, then connect Strava:

   ```bash
   docker compose up -d --force-recreate
   docker compose exec -it smartworkout enduo-smartworkout setup --strava
   ```

Setup prints a Strava authorization link. Approve **both** `activity:read_all` and `activity:write`, then copy
the complete final address from the browser back into setup. The localhost page need not open: no server or
listening port is required. Alternatively, `STRAVA_REFRESH_TOKEN` can bootstrap an already authorized session
with both scopes. Tokens refresh automatically; the latest rotated refresh token is saved on the volume and
takes precedence over ENV. Remove the bootstrap token from `.env` after connecting. To connect another Strava
account, run `setup --strava` again (remove the old `STRAVA_REFRESH_TOKEN` first, if present).

**Only new workouts.** The first enabled service pass saves a start boundary before contacting Strava. Workouts
that **started before that boundary** are never exported, including later edits of those workouts; `BACKFILL_DAYS`
applies to Enduo only. Keep `strava-sync.json` to preserve this boundary, activity ids and pending uploads. A
change of the SmartWorkout or Strava account archives that file and starts a new boundary for the new accounts.
Deleting it starts a new boundary too; it does not backfill history.

The agent uses [Strava's JSON strength upload format](https://developers.strava.com/docs/uploads/), with
`sport_type=WeightTraining`. It sends the actual start timestamp, local UTC offset at that date, duration and
every completed set in exercise/set order. No heart rate, calories, active time or per-set timestamps are
invented. A workout without a positive duration is skipped because Strava requires one; edit it to retry.

| SmartWorkout information | Strava |
|---|---|
| Exercise | Native `exercise_type`, matched against Strava's documented catalogue using its English name, independent of `EXERCISE_LANGUAGE` |
| Repetitions, weight in kg | Native `repetitions`, `weight` |
| Timed set | Native `duration` in seconds (rounded from SmartWorkout's milliseconds) |
| Workout name | Activity name |
| Assistance weight | Not sent: it is no lifted weight |
| Notes, RPE, set types, bands, body weight, timer | Not sent: Strava has no field for them, and the activity gets no description |

Names without a known match use Strava's `TOTAL_BODY_GENERIC`. The activity name is cleaned of invisible/control
characters. Matching aliases and the supported identifiers live in
`src/strava-mapping.ts` and `src/strava-exercises.ts`.

Strava processes uploads asynchronously. The upload id is saved immediately and checked on the next pass,
without uploading the file again. Each upload's `external_id` is a stable source id plus an attempt of its own:
Strava refuses at once ("Error Processing Data") any upload whose `external_id` was used before, even a valid
file after a failed upload. The stable part helps recover an activity when an upload response was lost. The
token needs `activity:read_all` to find private activities as well. Enduo and Strava have
independent cursors and retries: a failure of either does not prevent a pass for the other.

An edit of an exported workout updates that activity's **name**. Strava's documented update API cannot replace
uploaded native sets, start time or duration; those stay as first uploaded. The agent never deletes/recreates
activities to change them, and never writes a description: one you add on Strava stays.
Deleting a workout in SmartWorkout leaves its Strava activity in place. Strava's account visibility settings
apply to the exported activity.

`once --dry-run` also prints the JSON file and name that would be sent, without contacting Strava or changing
its session/sync files. `status` reports the Strava athlete, start boundary and pending uploads. Network errors,
429 and 5xx are retried on the next pass; a refused workout is retried when its revision changes. When Strava
cannot process a file, the log gives Strava's own reason (as plain text, at most 300 characters).

An idle pass makes no request to Strava: the athlete is verified once per sign-in (and by `setup`/`status`), not
on every pass. Strava's rate limits belong to your Strava application and count refused requests too. After a
429 the agent does not contact Strava until the limit resets: the next quarter hour, or midnight UTC when a daily
limit is used up. It says so once in the log.
If Strava rejects a file as duplicate data, the agent looks for its source id. It never adopts or edits
an activity from another source merely because its time matches; an unrelated duplicate is skipped.

## Commands

| Command | What it does |
|---|---|
| `enduo-smartworkout run` | the service (default command of the image) |
| `enduo-smartworkout setup [--smartworkout\|--enduo\|--strava]` | sign in; with a flag, sign in to that one again; the default also connects Strava when enabled |
| `enduo-smartworkout once [--dry-run]` | one pass now; `--dry-run` prints what would be sent and changes nothing |
| `enduo-smartworkout status` | sign-ins, sync state and optional Strava export |
| `enduo-smartworkout health` | exit 0 while the service runs (Docker healthcheck) |

Run them with `docker compose exec -it smartworkout enduo-smartworkout <command>`.

## Configuration

All optional; see [.env.example](.env.example).

| Variable | Default | Meaning |
|---|---|---|
| `ENDUO_URL` | `https://api.enduo.app` | Enduo API |
| `ENDUO_TOKEN` | — | personal access token (`write:strength`) instead of the sign-in with a code |
| `ENDUO_CLIENT_NAME` | `SmartWorkout Agent (<hostname>)` | name of the token in Enduo |
| `EXERCISE_LANGUAGE` | `en` | language of the exercise names, or a list such as `pl,en`; see [Exercise names](#exercise-names) |
| `POLL_SECONDS` | `300` | how often SmartWorkout is asked (at least 30) |
| `BACKFILL_DAYS` | `90` | how far back the first run goes; `0` sends only new workouts |
| `STRAVA_ENABLED` | `false` | enable export of new workouts to Strava (`true`/`1`; `false`/`0` disables it) |
| `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` | — | credentials of your own Strava application |
| `STRAVA_TIMEZONE` | `UTC` | IANA zone used to calculate each workout's display offset, e.g. `Europe/Warsaw` |
| `STRAVA_REFRESH_TOKEN` | — | optional bootstrap token authorized for `activity:read_all,activity:write`; the stored rotated token wins |
| `STRAVA_REDIRECT_URI` | `http://localhost/strava/callback` | browser setup redirect, within the registered callback domain |
| `SMARTWORKOUT_ACCESS_TOKEN`, `SMARTWORKOUT_REFRESH_TOKEN` | — | the SmartWorkout session, read once by `setup` |
| `SMARTWORKOUT_USER_AGENT` | `enduo-smartworkout-agent/<version> (+<this repository>)` | User-Agent of the calls to SmartWorkout; the iOS app sends e.g. `SmartWorkout/1634 CFNetwork/3860.700.2 Darwin/25.6.0` |
| `ENDUO_USER_AGENT` | the same default | User-Agent of the calls to Enduo |
| `STATE_DIR` | `/data` | the volume |

## State

Everything lives on the `/data` volume, readable only by the container's user. Keep it and back it up like a password
file:

| File | Content |
|---|---|
| `smartworkout.json` | the SmartWorkout session |
| `enduo.json` | the Enduo token |
| `strava.json` | optional Strava session, rotated refresh token and athlete id |
| `strava-sync.json` | separate Strava accounts, first enabled start boundary, cursor, handled revisions, activity ids and pending upload ids |
| `sync.json` | the accounts it belongs to (Enduo server, Enduo account id, SmartWorkout user id), the cursor of the change log, the revision sent of every workout, and the workouts skipped |
| `exercises.json` | the SmartWorkout exercise catalogue (names), revalidated with its ETag |

Deleting `sync.json` makes the next pass start over: it reads the whole change log again and sends what is within
`BACKFILL_DAYS`, the workouts skipped before included. Enduo recognises what it already has by the idempotency key
and the start time, so nothing is duplicated.

`sync.json` belongs to the accounts it was built from. When you sign the container in to another Enduo account,
another Enduo server or another SmartWorkout account, the next pass does not use it: it starts over as a first run
for the new accounts, renames the old file to `sync.<time>.other-account.json` (kept, never read again; delete it
when you do not need it) and says so once in the log. A `sync.json` written before the agent recorded the accounts
is taken for the accounts signed in at the first pass after the update.

## Verify the image

The release workflow of this repository signs every image it pushes with [cosign](https://docs.sigstore.dev/cosign/)
(keyless: the signature names the workflow that built the image, there is no key to trust). To check an image before
you run it, with cosign 3 or newer:

```bash
cosign verify sklimaszewski/enduo-smartworkout-agent:1.2.3 \
  --certificate-identity-regexp '^https://github\.com/sklimaszewski/enduo-smartworkout-agent/\.github/workflows/release\.yml@refs/(tags/v[0-9].*|heads/main)$' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

It succeeds only for an image built by [.github/workflows/release.yml](.github/workflows/release.yml) of this
repository; images released before signing was introduced have no signature. Run a version you verified instead of
`latest`: set `SMARTWORKOUT_AGENT_TAG=1.2.3` in `.env`, which `compose.yaml` reads, so the image changes only when
you change the version.

## Development

No runtime dependencies; Node 22.18+ runs the TypeScript sources directly.

```bash
npm install          # TypeScript and Node types, for the type check only
npm test
npm run typecheck
STATE_DIR=./data node src/main.ts once --dry-run
```

Releases: pushing a tag `vX.Y.Z` builds and pushes `sklimaszewski/enduo-smartworkout-agent:X.Y.Z` (and `X.Y`, `X`, `latest`)
with [.github/workflows/release.yml](.github/workflows/release.yml).

## Contributing

Issues and pull requests are welcome. When SmartWorkout changes its API, update
[docs/smartworkout-api.md](docs/smartworkout-api.md) together with the code. Never paste tokens, captured traffic
or workout data of a real account into an issue.

## License

[MIT](LICENSE). Enduo and SmartWorkout are trademarks of their owners; this project uses the names only to say what
it connects.
