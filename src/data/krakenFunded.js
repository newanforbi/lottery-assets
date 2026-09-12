// Kraken Funded — the $10K challenge book from the Kraken app (12 Sep 2026).
// Rules are the published Kraken Funded terms (Payward Oceanic Ltd / Breakout),
// not Kraken Prop. Multipliers are never stored here.

export const FUNDED_AS_OF = "2026-09-12";

export const FUNDED_RULES = {
  start: 10000,
  passPct: 0.12,
  failPct: 0.03,
  fee: 90,
  traderSplit: 0.8,
  houseSplit: 0.2,
  minPayout: 20,
  operator: "Payward Oceanic Ltd (BVI)",
  evaluator: "Breakout Trading Group, LLC",
};

/** Model spread — Kraken's FAQ has mentioned 0.04% each side; not part of the 12/3/80 contract. */
export const FUNDED_MODEL = {
  spreadEachSide: 0.0004,
};

export const FUNDED_TIERS = [
  { start: 1000, fee: 20 },
  { start: 5000, fee: 50 },
  { start: 10000, fee: 90 },
];

// Last prints from the Kraken Funded tab, 12 Sep 2026.
export const FUNDED_ASSETS = [
  { id: "BTC", name: "Bitcoin", ticker: "BTC", color: "#F7931A", lastPx: 77125.95, inBook: true },
  { id: "ETH", name: "Ethereum", ticker: "ETH", color: "#627EEA", lastPx: 2519.21, inBook: true },
  { id: "LINK", name: "Chainlink", ticker: "LINK", color: "#375BD2", lastPx: 11.49, inBook: true },
  { id: "BCH", name: "Bitcoin Cash", ticker: "BCH", color: "#0AC18E", lastPx: 225.15, inBook: true },
  { id: "DOGE", name: "Dogecoin", ticker: "DOGE", color: "#C2A633", lastPx: 0.08474, inBook: true },
  { id: "SHIB", name: "Shiba Inu", ticker: "SHIB", color: "#FF8A3D", lastPx: 0.000005293, inBook: true },
  { id: "ARB", name: "Arbitrum", ticker: "ARB", color: "#28A0F0", lastPx: 0.1397, inBook: false },
  { id: "BONK", name: "Bonk", ticker: "BONK", color: "#F2A900", lastPx: 0.00000279, inBook: false },
  { id: "AAVE", name: "Aave", ticker: "AAVE", color: "#B6509E", lastPx: 125.79, inBook: true },
  { id: "AVAX", name: "Avalanche", ticker: "AVAX", color: "#E84142", lastPx: 7.38, inBook: true },
  { id: "BNB", name: "BNB", ticker: "BNB", color: "#F3BA2F", lastPx: 726.15, inBook: false },
  { id: "CRV", name: "Curve", ticker: "CRV", color: "#A0B0FF", lastPx: 0.3337, inBook: true },
  { id: "DOT", name: "Polkadot", ticker: "DOT", color: "#E6007A", lastPx: 1.03, inBook: true },
  { id: "FIL", name: "Filecoin", ticker: "FIL", color: "#0090FF", lastPx: 0.8007, inBook: false },
  { id: "GRASS", name: "Grass", ticker: "GRASS", color: "#9AE66E", lastPx: 0.3302, inBook: false },
  { id: "ADA", name: "Cardano", ticker: "ADA", color: "#3CC8FF", lastPx: 0.20755, inBook: true },
  { id: "HBAR", name: "Hedera", ticker: "HBAR", color: "#8484FF", lastPx: 0.074566, inBook: true },
  { id: "INJ", name: "Injective", ticker: "INJ", color: "#22A3F0", lastPx: 6.03, inBook: false, inLottery: true },
  { id: "KAITO", name: "Kaito", ticker: "KAITO", color: "#7C8CFF", lastPx: 0.3073, inBook: false },
  { id: "LDO", name: "Lido DAO", ticker: "LDO", color: "#00A3FF", lastPx: 0.3718, inBook: false },
  { id: "LTC", name: "Litecoin", ticker: "LTC", color: "#6B8CFF", lastPx: 53.61, inBook: true },
  { id: "MOODENG", name: "Moo Deng", ticker: "MOODENG", color: "#C4A574", lastPx: 0.03965, inBook: false },
  { id: "NEAR", name: "NEAR Protocol", ticker: "NEAR", color: "#00C08B", lastPx: 2.35, inBook: true },
  { id: "PNUT", name: "Peanut the Squirrel", ticker: "PNUT", color: "#D4A017", lastPx: 0.04734, inBook: false },
  { id: "SOL", name: "Solana", ticker: "SOL", color: "#9D4EDD", lastPx: 101.32, inBook: true, inLottery: true },
  { id: "S", name: "Sonic", ticker: "S", color: "#5B8DEF", lastPx: 0.02708, inBook: false },
  { id: "TRUMP", name: "Official Trump", ticker: "TRUMP", color: "#C41E3A", lastPx: 1.99, inBook: false },
  { id: "UNI", name: "Uniswap", ticker: "UNI", color: "#FF007A", lastPx: 6.33, inBook: true },
  { id: "WLD", name: "Worldcoin", ticker: "WLD", color: "#B7B9C6", lastPx: 0.40003, inBook: true, inLottery: true },
  { id: "XRP", name: "XRP", ticker: "XRP", color: "#23F0C6", lastPx: 1.36, inBook: true, inLottery: true },
  { id: "ALGO", name: "Algorand", ticker: "ALGO", color: "#9AA0A6", lastPx: 0.09319, inBook: true },
  { id: "APT", name: "Aptos", ticker: "APT", color: "#2DD4BF", lastPx: 0.5995, inBook: false },
  { id: "ATOM", name: "Cosmos", ticker: "ATOM", color: "#6F7390", lastPx: 1.61, inBook: false },
  { id: "ETC", name: "Ethereum Classic", ticker: "ETC", color: "#3AB83A", lastPx: 7.63, inBook: false },
  { id: "JTO", name: "Jito", ticker: "JTO", color: "#A3E635", lastPx: 0.4395, inBook: false },
  { id: "JUP", name: "Jupiter", ticker: "JUP", color: "#C7A36A", lastPx: 0.2422, inBook: false },
  { id: "ONDO", name: "Ondo", ticker: "ONDO", color: "#1A73E8", lastPx: 0.3475, inBook: false },
  { id: "OP", name: "Optimism", ticker: "OP", color: "#FF0420", lastPx: 0.09597, inBook: false },
  { id: "POL", name: "Polygon", ticker: "POL", color: "#8247E5", lastPx: 0.0963, inBook: false },
  { id: "POPCAT", name: "Popcat", ticker: "POPCAT", color: "#F4B400", lastPx: 0.04798, inBook: false },
  { id: "RENDER", name: "Render", ticker: "RENDER", color: "#E04E2A", lastPx: 1.38, inBook: true },
  { id: "STX", name: "Stacks", ticker: "STX", color: "#5546FF", lastPx: 0.2668, inBook: false },
  { id: "SUI", name: "Sui", ticker: "SUI", color: "#4DA2FF", lastPx: 0.7221, inBook: true, inLottery: true },
  { id: "TAO", name: "Bittensor", ticker: "TAO", color: "#E8E8E8", lastPx: 231.95, inBook: false },
  { id: "TIA", name: "Celestia", ticker: "TIA", color: "#7B61FF", lastPx: 0.3522, inBook: false },
  { id: "TRX", name: "TRON", ticker: "TRX", color: "#FF3040", lastPx: 0.3397, inBook: true },
  { id: "WIF", name: "dogwifhat", ticker: "WIF", color: "#C4A574", lastPx: 0.1903, inBook: false },
  { id: "AIXBT", name: "aixbt", ticker: "AIXBT", color: "#9B8AFB", lastPx: 0.02028, inBook: false },
  { id: "ASTER", name: "Aster", ticker: "ASTER", color: "#E8C36A", lastPx: 0.6845, inBook: false },
  { id: "FARTCOIN", name: "Fartcoin", ticker: "FARTCOIN", color: "#8B7355", lastPx: 0.1432, inBook: false },
  { id: "FLOKI", name: "Floki", ticker: "FLOKI", color: "#F5A623", lastPx: 0.00002472, inBook: false },
  { id: "HYPE", name: "Hyperliquid", ticker: "HYPE", color: "#32DFC9", lastPx: 79.77, inBook: true },
  { id: "PENGU", name: "Pudgy Penguins", ticker: "PENGU", color: "#5B9DFF", lastPx: 0.007271, inBook: true },
  { id: "PUMP", name: "Pump.fun", ticker: "PUMP", color: "#2EE59D", lastPx: 0.003824, inBook: false },
  { id: "VIRTUAL", name: "Virtuals Protocol", ticker: "VIRTUAL", color: "#6EE7B7", lastPx: 0.6237, inBook: false },
  { id: "XPL", name: "Plasma", ticker: "XPL", color: "#94A3B8", lastPx: 0.07969, inBook: false },
  { id: "ZEC", name: "Zcash", ticker: "ZEC", color: "#F4B728", lastPx: 1121.76, inBook: true, inLottery: true },
  { id: "PEPE", name: "Pepe", ticker: "PEPE", color: "#4BE04B", lastPx: 0.000003411, inBook: true, inLottery: true },
];
