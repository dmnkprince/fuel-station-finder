-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    brand TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER NOT NULL,
    fuel_type TEXT CHECK(fuel_type IN ('PMS', 'AGO', 'DPK', 'LPG')) NOT NULL,
    price_per_litre REAL NOT NULL,
    is_available INTEGER CHECK(is_available IN (0, 1)) NOT NULL,
    queue_length TEXT CHECK(queue_length IN ('None', 'Short', 'Moderate', 'Long')) NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Index for performance when joining latest reports
CREATE INDEX IF NOT EXISTS idx_reports_station_created ON reports(station_id, created_at DESC);
