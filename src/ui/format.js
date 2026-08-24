// Extended from alpha-hybrid's formatCurrency — this dataset reaches into
// the hundreds of millions, so B/T buckets and finer precision matter.
export function formatCurrency(n) {
  if (!isFinite(n)) return "—";
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

export function formatFull(n) {
  if (!isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Prices here span $0.000000635 (Pepe) to $876.93 (Zcash) — one formatter
// can't use a fixed precision across nine orders of magnitude.
export function formatPrice(p) {
  if (p >= 1) return "$" + p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 0.01) return "$" + p.toFixed(4);
  if (p >= 0.0001) return "$" + p.toFixed(6);
  return "$" + p.toFixed(9).replace(/0+$/, "");
}

export function formatMultiple(m) {
  if (!isFinite(m)) return "—";
  if (m >= 1000) return Math.round(m).toLocaleString("en-US") + "×";
  if (m >= 100) return m.toFixed(0) + "×";
  if (m >= 10) return m.toFixed(1) + "×";
  return m.toFixed(2) + "×";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatDateShort(iso) {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} '${String(y).slice(2)}`;
}
