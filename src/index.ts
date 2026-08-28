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
export * from './lib/proxies-parser'
