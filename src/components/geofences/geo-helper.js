export const RADIUS_MAX_LIMIT = 500000;
export const RADIUS_MIN_LIMIT = 100;

export function getOuterPointOnCircle(bearing, center, radius) {
    const EARTH_RADIUS = 6371e3,
        brng = bearing * Math.PI / 180,
        d = radius,
        startLat = center.lat * Math.PI / 180,
        startLng = center.lng * Math.PI / 180;

    let lat = Math.asin(Math.sin(startLat) * Math.cos(d / EARTH_RADIUS) +
        Math.cos(startLat) * Math.sin(d / EARTH_RADIUS) * Math.cos(brng));
    let lng = startLng + Math.atan2(Math.sin(brng) * Math.sin(d / EARTH_RADIUS) * Math.cos(startLat),
        Math.cos(d / EARTH_RADIUS) - Math.sin(startLat) * Math.sin(lat));

    return {lat: lat * 180 / Math.PI, lng: lng * 180 / Math.PI};
}

export function getDistance(center, latLng) {
    return center.distanceTo(latLng);
}

