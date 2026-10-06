/**
 * NEXUS — Route error screen
 * Shown when a route throws or a lazy chunk fails to load (e.g. after a deploy
 * replaced the hashed files). Reloading fetches the fresh index.html.
 */

import { useRouteError } from 'react-router-dom'

export function RouteError() {
  const error = useRouteError()
  if (error) console.error('Route error:', error)
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 min-h-screen bg-nexus-bg text-nexus-text p-4 text-center"
    >
      <p className="font-mono uppercase tracking-[0.12em]">This screen did not load. Check your signal, then reload.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-4 py-2 border border-current min-h-[44px]"
      >
        <span className="font-mono uppercase tracking-[0.14em]">RELOAD</span>
      </button>
    </div>
  )
}
