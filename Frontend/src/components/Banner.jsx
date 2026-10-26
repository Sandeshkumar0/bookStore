import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="page-container grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
      <div className="max-w-2xl">
        <p className="mb-5 inline-flex rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          A better shelf starts here
        </p>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Stories that stay with you.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Explore hand-picked books for curious minds, lifelong learners, and anyone looking for their next unforgettable read.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/courses" className="button-primary">Browse the catalog <span aria-hidden="true">→</span></Link>
          <Link to="/signup" className="button-secondary">Create free account</Link>
        </div>
        <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div><dt className="text-2xl font-bold">100+</dt><dd className="text-sm text-slate-500">Curated titles</dd></div>
          <div><dt className="text-2xl font-bold">24/7</dt><dd className="text-sm text-slate-500">Browse anytime</dd></div>
          <div><dt className="text-2xl font-bold">Free</dt><dd className="text-sm text-slate-500">Books to begin</dd></div>
        </dl>
      </div>
      <div className="relative mx-auto w-full max-w-xl">
        <div className="absolute inset-8 -rotate-3 rounded-[3rem] bg-amber-300/60 blur-2xl dark:bg-amber-600/20" />
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <img src="/Banner.png" alt="Reader discovering books" className="h-auto w-full object-contain" />
        </div>
      </div>
    </section>
  );
}
