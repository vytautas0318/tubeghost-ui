// @tubeghost/ui — the surface shared by the TubeGhost web app and the
// TubeGhost Browser desktop app.
//
// Everything here is platform-neutral: no Electron, no window.api, no direct
// Supabase client. Anything needing those stays in the host app, or reaches
// the package through props.
//
// Design tokens ship as CSS, imported separately:
//   import '@tubeghost/ui/styles/ds-tokens.css'

export * from './components/ui'
export { cn } from './lib/cn'
export * from './components/ghost-avatar-parts'
export * from './lib/proxies-parser'

// Data-layer modules. These talk to Supabase through the seam below, so the
// host app must call setSupabaseGetter() once before rendering.
export * from './lib/account-security'
export * from './lib/authenticator'
export * from './lib/automations-data'
export * from './lib/avatar'
export * from './lib/edge'
export * from './lib/ip-allowlist'
export * from './lib/members'
export * from './lib/notifications'
export * from './lib/phone-links'
export * from './lib/profile-locks'
export * from './lib/roles'
export * from './lib/tags'
export * from './lib/workspace-admin'

// The platform seam: the host registers how to reach its Supabase client.
export { setSupabaseGetter, getSupabase, type GhostClient } from './platform/client'
