import { useMemo } from "react";
import { BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { buildBookLegs } from "../engine/leverage.js";
import Timeline from "./Timeline.jsx";

export default function ExchangeBook({ chain, setChain, capital }) {
  const legs = useMemo(() => buildBookLegs(3), []);

  return (
    <Timeline
      assets={BOOK_TRADEABLE}
      legs={legs}
      chain={chain}
      setChain={setChain}
      capital={capital}
      emptyHint="Click any bar to start a chain. Same calendar rule as the lottery — overlapping legs fade out — but every multiple is isolated 3× (3m − 2). A one-third drop from entry wipes the cash. Listing-month prints are already stripped."
    />
  );
}
