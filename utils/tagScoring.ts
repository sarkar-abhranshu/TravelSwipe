import { haversineDistance } from "./haversine";
import { Destination } from "../types/database";
import { Preferences } from "../types/database";

const NEAR_KM = 500;

export function scoreDestination(
  destination: Destination,
  prefs: Preferences,
  userLat: number | null,
  userLon: number | null
): number {
  let score = 0;

  // --- Tag overlap: +1 per matching tag ---
  const preferredSet = new Set(prefs.preferredTags);
  const tagScore = destination.tags.filter(tag =>
    preferredSet.has(tag)
  ).length;
  score += tagScore * 2; // ×2 so theme match outweighs fit bonuses

  // --- Trip duration fit: +2 if user's days fall within destination's range ---
  const isShortTrip = prefs.tripDuration === 'short';
  if (isShortTrip) {
    if (destination.trip_duration_min <= 3) score += 2;
  } else {
    if (destination.trip_duration_max >= 4) score += 2;
  }

  // --- Distance scoring ---
  // Skip entirely if location unavailable or destination has no coordinates
  if (
    userLat === null ||
    userLon === null ||
    destination.latitude === null ||
    destination.longitude === null
  ) {
    return score;
  }

  const distKm = haversineDistance(
    userLat,
    userLon,
    destination.latitude,
    destination.longitude
  );

  const isNear = distKm < NEAR_KM;
  const prefersFar = prefs.farDest;

  if (!prefersFar) {
    // Prefers close: reward near regardless of trip length
    if (isNear) score += 2;
  } else {
    // Prefers far: reward far only if trip is long enough to justify it
    if (!isNear && !isShortTrip) score += 2;
    // prefers far + short trip → no distance points (veto case)
  }

  return score;
}
