/**
 * Parse the per-set distance from an interval session description.
 * Expected format (AI-generated): "4×400m at 4:00/km with 90s rest between sets"
 * Returns distance in km (e.g. 400m → 0.4) or null if format is unrecognised.
 * When null, callers should exclude the session from distance/time totals
 * rather than falling back to 1 km/set (which would silently corrupt stats).
 */
export function parseIntervalDistanceKm(description: string | null): number | null {
  if (!description) return null;
  const match = description.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)\s*(m|km)\b/i);
  if (!match) return null;
  const dist = parseFloat(match[2]);
  const unit = match[3].toLowerCase();
  return unit === "km" ? dist : dist / 1000;
}
