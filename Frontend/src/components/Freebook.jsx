import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/api";
import Cards from "./Cards";

export default function Freebook() {
  const [state, setState] = useState({ books: [], loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    api("/book?category=Free&limit=8&sort=name", { signal: controller.signal })
      .then(({ books }) => setState({ books, loading: false, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ books: [], loading: false, error: error.message });
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="featured" className="page-container py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Start reading today</p>
          <h2 className="section-title">Free books, big ideas.</h2>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">A rotating selection you can add to your shelf without spending a cent.</p>
        </div>
        <Link to="/courses?category=Free" className="text-sm font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400">View all free books →</Link>
      </div>

      {state.loading && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading books">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />)}
        </div>
      )}
      {state.error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Couldn’t load the featured shelf. {state.error}
        </div>
      )}
      {!state.loading && !state.error && state.books.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">No free books have been added yet.</div>
      )}
      {state.books.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {state.books.map((book) => <Cards key={book._id} item={book} />)}
        </div>
      )}
    </section>
  );
}
