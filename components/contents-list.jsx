import "./contents-list.css";

/* A catalogue that reads like a contents page: a large title, one line
   under it, a figure at the right. A row opens in place, with native
   <details>, to show the facts and the action. Used by both hubs. */

export function ContentsGroup({ title, aside, children }) {
  return (
    <section className="toc-group">
      <div className="toc-head"><h3>{title}</h3>{aside && <span>{aside}</span>}</div>
      {children}
    </section>
  );
}

export function ContentsRow({ title, line, figure, sub, facts = [], link, open = false, children }) {
  return (
    <details className="toc-row" open={open || undefined}>
      <summary>
        <div><h4>{title}</h4><p>{line}</p></div>
        <p className="toc-figure"><b>{figure}</b><span>{sub}</span></p>
        <span className="toc-mark" aria-hidden="true">+</span>
      </summary>
      <div className="toc-open">
        <div>
          <dl>{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
          {link && <a className="link" href={link.href}>{link.label}</a>}
        </div>
        <div className="toc-action">{children}</div>
      </div>
    </details>
  );
}
