import { type FormEvent, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { siteContent } from "../content/site";
import { useAuth } from "../context/AuthProvider";
import { useCart } from "../context/CartProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/courses?search=${encodeURIComponent(query)}` : "/courses");
    setMenuOpen(false);
  };

  const signOut = () => {
    logout();
    toast.success("Archive session closed");
    navigate("/");
  };

  return (
    <header className={`site-header${location.pathname === "/" ? "" : " site-header--paper"}`}>
      <nav className="page-frame nav-grid" aria-label="Primary navigation">
        <Link to="/" className="wordmark" aria-label="BookStore home">
          <span className="wordmark-mark">B</span>
          <span>{siteContent.brand}</span>
          <small>Est. 2026</small>
        </Link>

        <button
          type="button"
          className="menu-trigger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>

        <div id="site-menu" className="nav-panel" data-open={menuOpen}>
          <div className="nav-links">
            {siteContent.navigation.map((item, index) => (
              item.to.startsWith("/#") ? (
                <a key={item.label} href={item.to} onClick={() => setMenuOpen(false)}>
                  <sup>0{index + 1}</sup>{item.label}
                </a>
              ) : (
                <NavLink key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>
                  <sup>0{index + 1}</sup>{item.label}
                </NavLink>
              )
            ))}
          </div>

          <form className="nav-search" role="search" onSubmit={submitSearch}>
            <label htmlFor="nav-search">Search the archive</label>
            <div>
              <input
                id="nav-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Author, title, idea"
              />
              <button type="submit" aria-label="Submit search">↗</button>
            </div>
          </form>

          <div className="nav-account">
            <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
              Reading bag <span>{String(count).padStart(2, "0")}</span>
            </Link>
            {user ? (
              <button type="button" onClick={signOut} className="account-link">
                {user.fullname.split(" ")[0]} / Sign out
              </button>
            ) : (
              <Link to="/login" className="account-link" onClick={() => setMenuOpen(false)}>Member access</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
