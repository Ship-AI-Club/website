import Scene from "./scene";

export default function WorkshopCard({ href, category, name, summary, meta, price, anchor, unit, tag, tagClass = "", artLabel }) {
  return (
    <article className="card wc-card">
      <a className="card-art" href={href} aria-label={`Explore ${name}`}>
        <Scene scene="workbench" cell={[5, 3]} />
        {(category || artLabel) && <span className="chip chip-quiet">{artLabel || category}</span>}
      </a>
      <div className="card-body">
        {category && <span className="chip chip-quiet wc-category">{category}</span>}
        <h3><a href={href}>{name}</a></h3>
        {summary && <p>{summary}</p>}
        {meta && <p className="meta">{meta}</p>}
        <div className="wc-card-bottom">
          <div>
            {price > 0 && (
              <p className="price price-sm">{anchor && <del aria-label={`Regular price ${anchor} dollars`}>${anchor.toLocaleString("en-US")}</del>}<strong>${price.toLocaleString("en-US")}</strong></p>
            )}
            {price === 0 && <p className="price price-sm"><strong>Free</strong></p>}
            {unit && <span className="price-unit">{unit}</span>}
          </div>
          {tag && <span className={`tag ${tagClass}`}>{tag}</span>}
        </div>
      </div>
    </article>
  );
}
