import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-container grid min-h-[60vh] place-items-center py-16 text-center">
      <div><p className="text-7xl font-bold text-amber-400">404</p><h1 className="mt-4 text-3xl font-bold">This page wandered off.</h1><p className="mt-3 text-slate-500">Let’s get you back to a shelf we know.</p><Link to="/" className="button-primary mt-7 inline-flex">Go home</Link></div>
    </section>
  );
}
