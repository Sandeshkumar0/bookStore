import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BookCard from "../components/BookCard";
import Reveal from "../components/Reveal";
import { api } from "../lib/api";
import type { Book, CatalogResponse } from "../types";

type Status = "loading" | "success" | "error";

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [draftSearch, setDraftSearch] = useState(params.get("search") || "");

  const query = useMemo(() => {
    const next = new URLSearchParams(params);
    next.set("limit", "8");
    return next.toString();
  }, [params]);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    api<CatalogResponse>(`/book?${query}`, { signal: controller.signal })
      .then((data) => {
        setBooks(data.books);
        setCategories(data.filters.categories);
        setPages(data.pagination.pages);
        setTotal(data.pagination.total);
        setStatus("success");
      })
      .catch((reason: Error) => {
        if (reason.name !== "AbortError") {
          setError(reason.message);
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, [query]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const page = Math.max(1, Number(params.get("page")) || 1);

  return (
    <div className="catalog-page">
      <header className="catalog-hero page-frame">
        <Reveal className="catalog-title-wrap">
          <p className="kicker dark"><span>●</span> Members’ reading room</p>
          <h1>The archive<br /><em>index.</em></h1>
        </Reveal>
        <Reveal className="catalog-intro" delay={100}>
          <span>CAT—001 / {String(total).padStart(2, "0")} RECORDS</span>
          <p>Search by title, author, or territory. Every work in this compact collection has been selected to reward sustained attention.</p>
        </Reveal>
      </header>

      <section className="catalog-controls page-frame" aria-label="Catalogue filters">
        <form
          className="catalog-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setFilter("search", draftSearch.trim());
          }}
        >
          <label htmlFor="catalog-search">Search index</label>
          <div>
            <input
              id="catalog-search"
              type="search"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Try “literature” or a title"
            />
            <button type="submit">Search ↗</button>
          </div>
        </form>
        <label className="select-control">
          <span>Territory</span>
          <select value={params.get("category") || "all"} onChange={(event) => setFilter("category", event.target.value)}>
            <option value="all">All territories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="select-control">
          <span>Sequence</span>
          <select value={params.get("sort") || "newest"} onChange={(event) => setFilter("sort", event.target.value)}>
            <option value="newest">Latest acquired</option>
            <option value="name">Title A–Z</option>
            <option value="price_asc">Price ascending</option>
            <option value="price_desc">Price descending</option>
          </select>
        </label>
      </section>

      <section className="catalog-results page-frame" aria-live="polite">
        <div className="catalog-result-line">
          <span>{status === "loading" ? "Consulting records…" : `${total} ${total === 1 ? "work" : "works"} located`}</span>
          {(params.get("search") || params.get("category")) && (
            <button type="button" onClick={() => { setDraftSearch(""); setParams({}); }}>Clear filters ×</button>
          )}
        </div>

        {status === "loading" && (
          <div className="catalog-skeleton" aria-label="Loading the catalogue">
            {Array.from({ length: 4 }, (_, index) => <span key={index} />)}
          </div>
        )}

        {status === "error" && (
          <div className="archive-state error-state" role="alert">
            <span>Index unavailable</span>
            <h2>The catalogue desk lost its connection.</h2>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>Reconnect ↻</button>
          </div>
        )}

        {status === "success" && books.length === 0 && (
          <div className="archive-state">
            <span>No matching record</span>
            <h2>This search left the shelf untouched.</h2>
            <p>Try a broader title or return to every territory in the archive.</p>
            <button type="button" onClick={() => { setDraftSearch(""); setParams({}); }}>View the full index ↗</button>
          </div>
        )}

        {status === "success" && books.length > 0 && (
          <div className="catalog-grid">
            {books.map((book, index) => <BookCard key={book._id} book={book} index={(page - 1) * 8 + index} />)}
          </div>
        )}

        {status === "success" && books.length > 0 && pages > 1 && (
          <nav className="pagination" aria-label="Catalogue pages">
            <button type="button" disabled={page <= 1} onClick={() => setFilter("page", String(page - 1))}>← Previous</button>
            <span>Page {page} / {pages}</span>
            <button type="button" disabled={page >= pages} onClick={() => setFilter("page", String(page + 1))}>Next →</button>
          </nav>
        )}
      </section>
    </div>
  );
}
