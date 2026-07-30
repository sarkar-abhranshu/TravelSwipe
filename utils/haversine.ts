export function haversineDistance(lat: number, long: number, currLat: number, currLong: number) {
  const R = 6371; // radius of earth in km
  const mulConst = Math.PI / 180;
  lat *= mulConst;
  long *= mulConst;
  currLat *= mulConst;
  currLong *= mulConst;

  const dLat = currLat - lat;
  const dLong = currLong - long;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat) * Math.cos(currLat) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}
