import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthProvider";
import { useCart } from "../context/CartProvider";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "hover:bg-slate-200 dark:hover:bg-slate-800"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const search = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/courses?search=${encodeURIComponent(value)}` : "/courses");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("You’re signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-stone-50/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="page-container flex h-20 items-center gap-5" aria-label="Main navigation">
        <Link to="/" className="group flex items-center gap-2" aria-label="BookStore home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400 text-xl text-slate-950 shadow-sm transition group-hover:-rotate-3">B</span>
          <span className="text-xl font-bold tracking-tight">Book<span className="text-amber-500">Store</span></span>
        </Link>

        <button
          type="button"
          className="ml-auto rounded-xl p-2 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-2xl">☰</span>
        </button>

        <div className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-20 flex-col gap-4 border-b bg-stone-50 p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          <div className="flex flex-col gap-1 lg:flex-row">
            <NavLink to="/" className={navClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/courses" className={navClass} onClick={() => setMenuOpen(false)}>Catalog</NavLink>
            <a href="/#about" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800">About</a>
          </div>

          <form onSubmit={search} className="relative lg:ml-auto lg:w-64" role="search">
            <label htmlFor="site-search" className="sr-only">Search books</label>
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles..."
              className="input-field py-2.5 pr-12"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 rounded-lg px-2.5 py-1.5" aria-label="Search">⌕</button>
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
              className="icon-button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <Link to="/cart" className="icon-button relative" aria-label={`Cart with ${count} items`}>
              🛒
              {count > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-950">{count}</span>}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-slate-500 xl:block">Hi, {user.fullname.split(" ")[0]}</span>
                <button type="button" onClick={handleLogout} className="button-secondary py-2">Sign out</button>
              </div>
            ) : (
              <Link to="/login" className="button-primary py-2">Sign in</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
