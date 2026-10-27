import { Link } from "react-router-dom";

import { siteContent } from "../content/site";
import Reveal from "./Reveal";

export default function Manifesto() {
  return (
    <section id="manifesto" className="manifesto-section">
      <div className="page-frame section-space">
        <Reveal className="manifesto-intro">
          <div className="section-number light">03 / POSITION</div>
          <p>We believe the interface around a book should create attention, not compete for it.</p>
          <h2>A bookstore can be<br />a <em>place of memory.</em></h2>
        </Reveal>

        <div className="manifesto-list">
          {siteContent.manifesto.map((item, index) => (
            <Reveal key={item.number} className="manifesto-row" delay={index * 90}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="manifesto-cta" delay={160}>
          <p>Ready to enter the index?</p>
          <Link to="/signup">Create a reader profile <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
