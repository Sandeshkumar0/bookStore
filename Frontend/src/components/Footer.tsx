import { Link } from "react-router-dom";

import { siteContent } from "../content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-frame footer-grid">
        <div className="footer-wordmark">Book<br /><em>Store</em></div>
        <div className="footer-note">
          <span>Colophon</span>
          <p>A living digital archive for patient discovery, built with deliberate motion and an enduring respect for the written word.</p>
        </div>
        <nav aria-label="Footer navigation">
          {siteContent.navigation.map((item) => (
            item.to.startsWith("/#")
              ? <a key={item.label} href={item.to}>{item.label}</a>
              : <Link key={item.label} to={item.to}>{item.label}</Link>
          ))}
          <Link to="/cart">Reading bag</Link>
        </nav>
        <div className="footer-contact">
          <span>Correspondence</span>
          <a href="mailto:hello@bookstore.example">hello@bookstore.example</a>
        </div>
      </div>
      <div className="footer-base page-frame">
        <span>© {new Date().getFullYear()} BookStore</span>
        <span>Designed for long attention</span>
        <a href="#top">Return to top ↑</a>
      </div>
    </footer>
  );
}
