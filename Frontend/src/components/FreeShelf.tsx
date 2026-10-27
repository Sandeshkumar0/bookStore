import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/api";
import type { Book, CatalogResponse } from "../types";
import BookCard from "./BookCard";
import Reveal from "./Reveal";

interface ShelfState {
  books: Book[];
  status: "loading" | "success" | "error";
  error: string;
}

export default function FreeShelf() {
  const [state, setState] = useState<ShelfState>({ books: [], status: "loading", error: "" });

  useEffect(() => {
    const controller = new AbortController();
    api<CatalogResponse>("/book?category=Free&limit=6&sort=name", { signal: controller.signal })
      .then(({ books }) => setState({ books, status: "success", error: "" }))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState({ books: [], status: "error", error: error.message });
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="free-shelf" className="free-shelf page-frame section-space" aria-labelledby="free-shelf-title">
      <Reveal className="section-heading">
        <div className="section-number">02 / OPEN SHELF</div>
        <div>
          <p className="kicker dark">No gate. No fine print.</p>
          <h2 id="free-shelf-title">Begin with<br /><em>something free.</em></h2>
        </div>
        <p>Foundational texts and enduring stories, open to every reader from the first page.</p>
      </Reveal>

      {state.status === "loading" && (
        <div className="shelf-loading" aria-label="Cataloguing open-access books">
          {Array.from({ length: 3 }, (_, index) => <span key={index} />)}
        </div>
      )}

      {state.status === "error" && (
        <div className="archive-state error-state" role="alert">
          <span>Connection interrupted</span>
          <h3>The open shelf is temporarily out of reach.</h3>
          <p>{state.error}</p>
          <button type="button" onClick={() => window.location.reload()}>Try the connection again ↻</button>
        </div>
      )}

      {state.status === "success" && state.books.length === 0 && (
        <div className="archive-state">
          <span>Shelf awaiting acquisition</span>
          <h3>No open-access volumes have been catalogued yet.</h3>
          <p>The shelf is ready; add a book marked “Free” to make it appear here.</p>
        </div>
      )}

      {state.books.length > 0 && (
        <div className="free-book-grid">
          {state.books.map((book, index) => <BookCard key={book._id} book={book} index={index} />)}
        </div>
      )}

      <Reveal className="shelf-footer" delay={120}>
        <span>{String(state.books.length).padStart(2, "0")} works currently on view</span>
        <Link to="/courses?category=Free">Inspect the complete shelf <span aria-hidden="true">↗</span></Link>
      </Reveal>
    </section>
  );
}
