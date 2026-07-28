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
