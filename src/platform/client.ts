// The Supabase client seam.
//
// Both host apps create their own client — the desktop app and the web app
// differ in how they persist a session (Electron storage vs browser storage)
// and in the extra clients each needs. But every module in this package uses
// the SAME two things: getSupabase() and the GhostClient type.
//
// So rather than import the host's module directly (there are two, at the same
// specifier), the host registers its getter once at startup and the package
// reads it through here. That keeps this package free of any assumption about
// how the client was built or where the session lives.

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * A Supabase client bound to the `ghost` schema.
 *
 * SupabaseClient is a class with protected members, so TypeScript compares it
 * NOMINALLY: the host app's client only satisfies this if both resolve the
 * SAME copy of @supabase/supabase-js. That is why the SDK is a peerDependency
 * here and why this package must not carry its own copy — see the note in
 * package.json.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GhostClient = SupabaseClient<any, any, 'ghost', any, any>

type Getter = () => GhostClient | null

let getter: Getter | null = null

/**
 * Register the host app's client getter. Call once, before rendering.
 *
 * Takes the GETTER rather than a client instance: the host may create its
 * client lazily (after config loads, or after a session is restored), and a
 * value captured at startup would pin a stale — or null — client forever.
 */
export function setSupabaseGetter(fn: Getter): void {
  getter = fn
}

/**
 * The host's Supabase client, or null when it isn't configured.
 *
 * Returns null rather than throwing when unregistered, matching the host
 * modules' own contract: callers already handle a null client (the app renders
 * a "not configured" state), so an unset seam degrades the same way instead of
 * crashing the render.
 */
export function getSupabase(): GhostClient | null {
  return getter ? getter() : null
}
