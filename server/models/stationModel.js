import db from '../config/db.js';

/**
 * Fetch all stations joined with their single most recent report.
 * The backend computes pin status metadata before returning JSON.
 * Status logic:
 *   - green:  is_available=1, updated < 2 hours ago
 *   - red:    is_available=0, updated < 6 hours ago
 *   - yellow: is_available=1, queue_length IN ('Moderate','Long'), updated < 2 hours ago
 *   - grey:   no report, OR last update > 6 hours ago
 */
export function findAllWithLatestReport() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        s.id,
        s.name,
        s.address,
        s.latitude,
        s.longitude,
        s.brand,
        s.created_at,
        r.id            AS report_id,
        r.fuel_type,
        r.price_per_litre,
        r.is_available,
        r.queue_length,
        r.upvotes,
        r.created_at    AS report_created_at
      FROM stations s
      LEFT JOIN reports r ON r.id = (
        SELECT id FROM reports
        WHERE station_id = s.id
        ORDER BY created_at DESC
        LIMIT 1
      )
      ORDER BY s.id ASC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);

      // Compute status color and time-since for each station
      const now = Date.now();
      const stations = rows.map((row) => {
        const reportAge = row.report_created_at
          ? (now - new Date(row.report_created_at).getTime()) / (1000 * 60) // age in minutes
          : Infinity;

        let status = 'grey';
        if (row.report_id && reportAge <= 720) { // within 12 hours
          if (!row.is_available) {
            status = 'red';
          } else if (reportAge <= 120 && (row.queue_length === 'Moderate' || row.queue_length === 'Long')) {
            status = 'yellow';
          } else if (reportAge <= 120) {
            status = 'green';
          } else {
            status = 'grey'; // stale (2-12 hours)
          }
        }

        return {
          id: row.id,
          name: row.name,
          address: row.address,
          latitude: row.latitude,
          longitude: row.longitude,
          brand: row.brand,
          created_at: row.created_at,
          status,
          latest_report: row.report_id
            ? {
                id: row.report_id,
                fuel_type: row.fuel_type,
                price_per_litre: row.price_per_litre,
                is_available: Boolean(row.is_available),
                queue_length: row.queue_length,
                upvotes: row.upvotes,
                created_at: row.report_created_at,
                minutes_ago: Math.round(reportAge),
              }
            : null,
        };
      });

      resolve(stations);
    });
  });
}

/**
 * Fetch a single station by its ID along with all historical reports.
 */
export function findById(id) {
  return new Promise((resolve, reject) => {
    const stationSql = `SELECT * FROM stations WHERE id = ?`;
    db.get(stationSql, [id], (err, station) => {
      if (err) return reject(err);
      if (!station) return resolve(null);

      const reportsSql = `
        SELECT * FROM reports
        WHERE station_id = ?
        ORDER BY created_at DESC
      `;
      db.all(reportsSql, [id], (rErr, reports) => {
        if (rErr) return reject(rErr);
        resolve({ ...station, reports });
      });
    });
  });
}

/**
 * Insert a new station into the database.
 */
export function create({ name, address, latitude, longitude, brand }) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO stations (name, address, latitude, longitude, brand)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [name, address, latitude, longitude, brand], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, name, address, latitude, longitude, brand });
    });
  });
}
