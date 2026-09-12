import { ASSETS } from "../data/assets.js";
import { LEGS } from "../engine/solver.js";
import Timeline from "./Timeline.jsx";

export default function Lottery({ chain, setChain, capital }) {
  return (
    <Timeline
      assets={ASSETS}
      legs={LEGS}
      chain={chain}
      setChain={setChain}
      capital={capital}
      emptyHint="Click any bar to start a chain. Bars that overlap what you already hold will fade out — one pool of capital can only be in one position at a time, which is the whole constraint Lottery Assets exists to make visible."
    />
  );
}
