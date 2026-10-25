import { WORKSHOP_BENEFITS } from "../lib/workshops";

export default function WorkshopBenefits() {
  return <section className="vg-curriculum" aria-labelledby="workshop-benefits-title">
    <p className="kicker">Included With Your Workshop</p>
    <h2 id="workshop-benefits-title">Keep Building After The Session.</h2>
    <div className="vg-benefit-grid">{WORKSHOP_BENEFITS.map((benefit) => <article className="vg-topic" key={benefit.title}><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div>
  </section>;
}
