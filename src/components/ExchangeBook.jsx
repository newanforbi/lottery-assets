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
      emptyHint="Click any bar to start a chain. $3,000 cash buys $9,000 of the coin — isolated 3×, so a 2× spot move is 4× on your cash (3m − 2). Overlapping legs fade out. A one-third drop from entry wipes the equity. Listing-month prints are already stripped."
    />
  );
}
