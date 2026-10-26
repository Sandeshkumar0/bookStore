import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-screen bg-stone-50 dark:bg-slate-950 lg:grid-cols-2">
      <section className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="text-2xl font-bold">Book<span className="text-amber-400">Store</span></Link>
        <blockquote className="max-w-lg">
          <p className="text-4xl font-bold leading-tight">“A reader lives a thousand lives before they die.”</p>
          <footer className="mt-5 text-slate-400">— George R. R. Martin</footer>
        </blockquote>
        <p className="text-sm text-slate-500">Your next chapter starts here.</p>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-600">← Back home</Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-7 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </section>
    </main>
  );
}
