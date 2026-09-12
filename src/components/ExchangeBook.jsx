import { useMemo } from "react";
import { BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { BOOK_BORROW_APR, buildBookLegs } from "../engine/leverage.js";
import { formatFull } from "../ui/format.js";
import Timeline from "./Timeline.jsx";

export default function ExchangeBook({ chain, setChain, capital }) {
  const legs = useMemo(() => buildBookLegs(BOOK_LEVERAGE), []);
  const buyingPower = capital * BOOK_LEVERAGE;
  const dead = legs.filter((l) => l.liquidated).length;

  return (
    <Timeline
      assets={BOOK_TRADEABLE}
      legs={legs}
      chain={chain}
      setChain={setChain}
      capital={capital}
      emptyHint={`${formatFull(capital)} cash buys ${formatFull(buyingPower)}. Isolated ${BOOK_LEVERAGE}×, model borrow ${Math.round(BOOK_BORROW_APR * 100)}% APR on the loan. A monthly close through entry × ⅔ zeros the leg — those bars are hatched and out of Solve${dead ? ` (${dead} dead on this book)` : " (none on the current monthly closes)"}. Intra-month wicks are not in the tape.`}
    />
  );
}
