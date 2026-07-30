// Maps API codes (stored in DB) to human-readable names
export const FUEL_NAME_MAP = {
  PMS: 'Petrol',
  AGO: 'Diesel',
  DPK: 'Kerosene',
  LPG: 'Cooking Gas',
};

// Maps human-readable names back to API codes
export const FUEL_CODE_MAP = {
  Petrol: 'PMS',
  Diesel: 'AGO',
  Kerosene: 'DPK',
  'Cooking Gas': 'LPG',
};

// Converts API code to display name e.g. "PMS" → "Petrol"
export const getFuelDisplay = (code) => {
  if (!code) return '—';
  return FUEL_NAME_MAP[code] || code;
};

// Converts display name to API code e.g. "Petrol" → "PMS"
export const getFuelCode = (name) => {
  if (!name) return name;
  return FUEL_CODE_MAP[name] || name;
};

/**
 * Haversine formula — straight-line distance between two lat/lon points.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {string} Distance in km, formatted to 1 decimal (e.g. "3.4 km")
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
};
