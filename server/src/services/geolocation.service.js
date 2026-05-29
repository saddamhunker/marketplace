export function buildNearQuery({ longitude, latitude, maxDistanceKm = 5 }) {
  return {
    $near: {
      $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
      $maxDistance: maxDistanceKm * 1000
    }
  };
}

export function kilometersBetween([lonA, latA], [lonB, latB]) {
  const radius = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(latB - latA);
  const dLon = toRad(lonB - lonA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * Math.sin(dLon / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
