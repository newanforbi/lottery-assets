import { useMemo } from "react";
import { BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { buildBookLegs } from "../engine/leverage.js";
import { formatFull } from "../ui/format.js";
import Timeline from "./Timeline.jsx";

export default function ExchangeBook({ chain, setChain, capital }) {
  const legs = useMemo(() => buildBookLegs(BOOK_LEVERAGE), []);
  const buyingPower = capital * BOOK_LEVERAGE;

  return (
    <Timeline
      assets={BOOK_TRADEABLE}
      legs={legs}
      chain={chain}
      setChain={setChain}
      capital={capital}
      emptyHint={`Click any bar to start a chain. ${formatFull(capital)} cash buys ${formatFull(buyingPower)} of the coin — isolated ${BOOK_LEVERAGE}×, so a 2× spot move is 4× on your cash (${BOOK_LEVERAGE}m − ${BOOK_LEVERAGE - 1}). Overlapping legs fade out. A one-third drop from entry wipes the equity. Listing-month prints are already stripped.`}
    />
  );
}
