// Keep the original Ship AI mark intact; topic artwork is a separate asset.
export default function WorkshopArt({ slug, label }) {
  return <div className={`wc-art wc-art-${slug}`}>
    <img className="wc-art-scene" src={`/workshop-art/${slug}.svg`} alt="" width={720} height={420} />
    <span className="wc-art-brand"><img src="/logo-mark.png" alt="" width={25} height={25} />Ship AI<span>Workshops</span></span>
    {label && <span className="wc-art-label">{label}</span>}
  </div>;
}
