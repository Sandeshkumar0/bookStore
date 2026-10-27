import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";

import { featuredBook, purchaseFormats, storyChapters } from "../content/story";
import { useCart } from "../context/CartProvider";
import { useReducedMotion } from "../hooks/useReducedMotion";

const StoryBookScene = lazy(() => import("./StoryBookScene"));

function StoryPoster() {
  return (
    <div className="story-poster" aria-hidden="true">
      <div className="poster-shadow" />
      <div className="poster-book"><i /><span>THE CARTOGRAPHER<br /><em>OF LOST HOURS</em></span></div>
      <div className="poster-pedestal" />
    </div>
  );
}

export default function StoryExperience() {
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(() => window.innerWidth < 760);
  const [format, setFormat] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 759px)");
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;

    if (reducedMotion) {
      progressRef.current = 0.28;
      element.style.setProperty("--story-progress", ".28");
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        element.style.setProperty("--story-progress", String(self.progress));
        const next = Math.min(5, Math.floor(self.progress * 6));
        setActive((current) => current === next ? current : next);
      },
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  const selected = purchaseFormats[format];
  const addFeatured = () => {
    addItem({ ...featuredBook, price: selected.price, title: `${featuredBook.title} · ${selected.label}` });
    toast.success(`${selected.label} added to your reading bag`);
  };

  return (
    <section ref={root} className="story-experience" aria-label="The Cartographer of Lost Hours immersive feature">
      <div className="story-stage">
        <StoryPoster />
        <Suspense fallback={null}><StoryBookScene progressRef={progressRef} compact={compact} /></Suspense>

        <div className="story-vignette" aria-hidden="true" />
        <div className="story-running-label"><span>BOOKSTORE / FEATURED ACQUISITION</span><span>THE EMBER ARCHIVE</span></div>
        <div className="story-progress" aria-label={`Story chapter ${active + 1} of 6`}>
          <span style={{ transform: `scaleX(${(active + 1) / 6})` }} />
          <output>{String(active + 1).padStart(2, "0")} / 06</output>
        </div>

        {storyChapters.map((chapter, index) => (
          <article key={chapter.index} className={`story-chapter story-chapter--${chapter.align}`} data-active={active === index} aria-hidden={active !== index}>
            <span className="story-chapter-index">{chapter.index}</span>
            <p className="kicker"><span>●</span>{chapter.eyebrow}</p>
            <h1>{chapter.title[0]}<br /><em>{chapter.title[1]}</em></h1>
            <p className="story-chapter-body">{chapter.body}</p>
            <small>{chapter.note}</small>
          </article>
        ))}

        <article className="story-purchase" data-active={active === 5} aria-hidden={active !== 5}>
          <p className="kicker"><span>●</span>The return · Your copy</p>
          <h2>Carry the story<br /><em>beyond this room.</em></h2>
          <p>First edition with cloth cover, foil-stamped spine, illustrated endpapers, and a sewn binding designed to open flat.</p>
          <fieldset>
            <legend>Select format</legend>
            {purchaseFormats.map((item, index) => (
              <button key={item.label} type="button" data-selected={format === index} onClick={() => setFormat(index)}>
                <span>{item.label}</span><strong>${item.price}</strong>
              </button>
            ))}
          </fieldset>
          <div className="purchase-actions">
            <button type="button" className="purchase-primary" onClick={addFeatured}>Add to reading bag <span>↗</span></button>
            <button type="button" className="wishlist" aria-pressed={wishlisted} onClick={() => setWishlisted((value) => !value)}>{wishlisted ? "Saved ♥" : "Save ♡"}</button>
          </div>
          <small>Dispatches in 1–2 days · Free delivery over $35 · 30-day returns</small>
        </article>
      </div>
      <div className="story-markers" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
    </section>
  );
}
