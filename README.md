# @tubeghost/ui

UI primitives, design tokens and platform-neutral logic shared by:

- **tubeghost-app** — the web app (app.tubeghost.com)
- **tubeghost-browser-macos** — the TubeGhost Browser desktop app

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

Host apps currently consume this by path alias (see each app's `vite.config.ts`
and `tsconfig.json`), so the original `@/components/ui` import specifiers keep
working unchanged.

## Checks

```
npm install
npx tsc -p tsconfig.json --noEmit
```
