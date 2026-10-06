/**
 * NEXUS — Unknown address
 *
 * An address that is not in the case file. Reached by a mistyped link or a
 * marker printed for something that was withdrawn; it names what is true and
 * the one way out.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/config'

export function NoSuchRecord() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nexus-bg p-6 text-center text-nexus-text">
      <p className="font-mono text-[0.8125rem] uppercase tracking-[0.2em] text-nexus-textSubtle">NEXUS ECHO / CASE 037</p>
      <h1 className="heading-3">NO SUCH RECORD</h1>
      <p className="nx-body max-w-[40ch] text-nexus-textMuted">This address is not in the case file.</p>
      <Link to={ROUTES.PLAYER_LOGIN} className="nx-action min-h-[44px]">
        <span>RETURN TO CASE</span>
      </Link>
    </div>
  )
}
