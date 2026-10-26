import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { api } from "../lib/api";
import Cards from "./Cards";

export default function Course() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [draftSearch, setDraftSearch] = useState(search);
  const [state, setState] = useState({ books: [], categories: [], pagination: null, loading: true, error: "" });

  useEffect(() => setDraftSearch(search), [search]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), limit: "12", sort });
    if (search) query.set("search", search);
    if (category !== "All") query.set("category", category);

    setState((current) => ({ ...current, loading: true, error: "" }));
    api(`/book?${query}`, { signal: controller.signal })
      .then(({ books, pagination, filters }) => {
        setState({ books, pagination, categories: filters.categories, loading: false, error: "" });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState((current) => ({ ...current, books: [], loading: false, error: error.message }));
        }
      });

    return () => controller.abort();
  }, [search, category, sort, page]);

  const updateFilters = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All" || value === "newest") next.delete(key);
      else next.set(key, String(value));
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    updateFilters({ search: draftSearch.trim() });
  };

  return (
    <section className="page-container py-12 lg:py-16">
      <div className="rounded-[2rem] bg-slate-900 px-6 py-10 text-white sm:px-10 lg:flex lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-amber-400">Members’ library</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Find your next favorite.</h1>
          <p className="mt-4 max-w-xl text-slate-300">Search the collection, filter by category, and build a reading list that’s completely yours.</p>
        </div>
        {state.pagination && <p className="mt-6 text-sm text-slate-400 lg:mt-0">{state.pagination.total} {state.pagination.total === 1 ? "book" : "books"} found</p>}
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_200px_200px]">
        <form onSubmit={submitSearch} className="flex gap-2">
          <label htmlFor="catalog-search" className="sr-only">Search catalog</label>
          <input id="catalog-search" type="search" value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder="Title, topic, or keyword" className="input-field" />
          <button className="button-primary px-4" type="submit">Search</button>
        </form>
        <label>
          <span className="sr-only">Category</span>
          <select value={category} onChange={(event) => updateFilters({ category: event.target.value })} className="input-field">
            <option>All</option>
            {state.categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort books</span>
          <select value={sort} onChange={(event) => updateFilters({ sort: event.target.value })} className="input-field">
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {state.loading && <div className="grid min-h-80 place-items-center"><span className="loading loading-spinner loading-lg text-amber-500" /></div>}
      {state.error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{state.error}</div>}
      {!state.loading && !state.error && state.books.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
          <p className="text-xl font-bold">No books match those filters.</p>
          <button type="button" onClick={() => { setDraftSearch(""); setSearchParams({}); }} className="mt-4 text-sm font-bold text-amber-600">Clear all filters</button>
        </div>
      )}
      {!state.loading && state.books.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {state.books.map((book) => <Cards key={book._id} item={book} />)}
        </div>
      )}

      {state.pagination?.pages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Catalog pagination">
          <button type="button" disabled={page <= 1} onClick={() => updateFilters({ page: page - 1 })} className="button-secondary disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {state.pagination.pages}</span>
          <button type="button" disabled={page >= state.pagination.pages} onClick={() => updateFilters({ page: page + 1 })} className="button-secondary disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      )}
    </section>
  );
}
