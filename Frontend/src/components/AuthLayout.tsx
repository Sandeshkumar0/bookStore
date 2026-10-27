import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import ArchiveFallback from "./ArchiveFallback";

export default function AuthLayout({ mode, children }: { mode: "login" | "signup"; children: ReactNode }) {
  const isLogin = mode === "login";
  return (
    <main className="auth-page">
      <Link to="/" className="auth-wordmark" aria-label="Return to BookStore">B <span>BookStore</span></Link>
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual-copy">
          <span>Private reading room / Access 01</span>
          <h1>{isLogin ? <>Return to your<br /><em>unfinished page.</em></> : <>Begin a shelf<br /><em>of your own.</em></>}</h1>
          <p>{isLogin ? "Your catalogue, reading bag, and next discovery are waiting where you left them." : "A quiet place to keep the books you intend to meet—and the ideas worth returning to."}</p>
        </div>
        <ArchiveFallback />
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </section>
    </main>
  );
}
