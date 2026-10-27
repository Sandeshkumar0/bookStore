import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found page-frame">
      <span>404 / Uncatalogued page</span>
      <strong aria-hidden="true">404</strong>
      <div><h1>This page has left<br /><em>the collection.</em></h1><p>The record may have moved, or perhaps it was never acquired.</p><Link to="/">Return to the reading room ↗</Link></div>
    </section>
  );
}
