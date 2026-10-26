import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="page-container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Link to="/" className="text-xl font-bold">Book<span className="text-amber-500">Store</span></Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">A friendly place to discover books that teach, entertain, and inspire.</p>
        </div>
        <div>
          <h2 className="font-bold">Explore</h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-slate-500" aria-label="Footer navigation">
            <Link to="/courses" className="hover:text-amber-600">Catalog</Link>
            <Link to="/cart" className="hover:text-amber-600">Cart</Link>
            <a href="/#about" className="hover:text-amber-600">About us</a>
          </nav>
        </div>
        <div>
          <h2 className="font-bold">Need help?</h2>
          <a href="mailto:hello@bookstore.example" className="mt-3 inline-block text-sm text-slate-500 hover:text-amber-600">hello@bookstore.example</a>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} BookStore. Built for readers.
      </div>
    </footer>
  );
}
