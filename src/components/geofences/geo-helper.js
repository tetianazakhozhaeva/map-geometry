export const RADIUS_MAX_LIMIT = 500000;
export const RADIUS_MIN_LIMIT = 100;

export function getOuterPointOnCircle(bearing, center, radius) {
  const EARTH_RADIUS = 6371e3;
  const brng = bearing * Math.PI / 180;
  const d = radius;
  const startLat = center.lat * Math.PI / 180;
  const startLng = center.lng * Math.PI / 180;

  const lat = Math.asin(Math.sin(startLat) * Math.cos(d / EARTH_RADIUS) +
        Math.cos(startLat) * Math.sin(d / EARTH_RADIUS) * Math.cos(brng));
  const lng = startLng + Math.atan2(
    Math.sin(brng) * Math.sin(d / EARTH_RADIUS) * Math.cos(startLat),
    Math.cos(d / EARTH_RADIUS) - Math.sin(startLat) * Math.sin(lat),
  );

  return { lat: lat * 180 / Math.PI, lng: lng * 180 / Math.PI };
}

export function getDistance(center, latLng) {
  return center.distanceTo(latLng);
}

export function calcMiddleLatLng(latlng1, latlng2, map) {
  const p1 = map.project(latlng1);
  const p2 = map.project(latlng2);

  const latlng = map.unproject(p1._add(p2)._divideBy(2));

  return latlng;
}
