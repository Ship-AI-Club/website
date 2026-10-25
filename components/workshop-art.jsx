import Scene from "./scene";

export default function WorkshopArt({ label, scene = "workbench" }) {
  return <div className="wc-art card-art">
    <Scene scene={scene} cell={[5, 3]} />
    {label && <span className="chip chip-quiet">{label}</span>}
  </div>;
}
