# @tubeghost/ui

UI primitives, design tokens and platform-neutral logic for TubeGhost.

**Consumed today by:** `tubeghost-app` — the web app (app.tubeghost.com).

**Designed for both.** Every module here is platform-neutral and the desktop
app (`tubeghost-browser-macos`) holds byte-identical copies of all of them, so
it can adopt this package by declaring the same dependency and swapping its
imports — no code change required. That step is deliberately deferred; the
desktop app is untouched for now.

## Why

Both apps render the same product. Before this package the screens existed as
two copies, so every change had to be made twice and the two drifted apart.
Anything in here is written once and used by both.

## What belongs here

Platform-neutral code only: no Electron, no `window.api`, no direct Supabase
client, no router assumptions. Anything needing those stays in the host app, or
reaches this package through props.

The desktop app can do things a browser cannot — launch a browser engine, sync
local sessions, read engine logs. Those stay desktop-only by design; a shared
component that needs one takes it as an optional capability from its host.

## Layout

```
src/
  components/ui/   Button, Input, Select, Badge, Toggle, …
  lib/             data modules (Supabase) + pure helpers
  platform/        the seams — how the package reaches host capabilities
  automations/     shared automation types
  styles/          ds-tokens.css — the design tokens both apps share
  index.ts         the package entry point
```

## The platform seam

Data modules here talk to Supabase, but each host app builds its own client
(different session persistence). Rather than import one of them, the host
registers its getter once at startup:

```ts
import { setSupabaseGetter } from '@ui'
import { getSupabase } from './lib/supabase'

setSupabaseGetter(getSupabase)   // before the first render
```

`@supabase/supabase-js` is a **peerDependency** and this package must not carry
its own copy: `SupabaseClient` is a class with protected members, so TypeScript
compares it nominally — a second copy would make the host's real client fail to
satisfy the seam.

## Usage

```ts
import { Button, Badge, cn } from '@tubeghost/ui'
import '@tubeghost/ui/styles/ds-tokens.css'
```

Consumed as a normal npm dependency:

```json
"dependencies": { "@tubeghost/ui": "file:../tubeghost-ui" }
```

The `file:` link makes this behave like a published package while it lives
beside the app. Once this repo has a remote, only that one line changes — to a
git or npm URL — and nothing in the importing code moves.

## Checks

```
npm install
npx tsc -p tsconfig.json --noEmit
```
