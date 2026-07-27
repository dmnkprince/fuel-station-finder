import db from '../config/db.js';

/**
 * Fetch all reports for a specific station (for historical view).
 */
export function findByStationId(stationId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM reports
      WHERE station_id = ?
      ORDER BY created_at DESC
    `;
    db.all(sql, [stationId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Insert a new crowdsourced report into the database.
 */
export function create({ station_id, fuel_type, price_per_litre, is_available, queue_length }) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [station_id, fuel_type, price_per_litre, is_available ? 1 : 0, queue_length],
      function (err) {
        if (err) return reject(err);
        // Fetch and return the newly inserted report
        db.get(`SELECT * FROM reports WHERE id = ?`, [this.lastID], (fetchErr, row) => {
          if (fetchErr) return reject(fetchErr);
          resolve(row);
        });
      }
    );
  });
}

/**
 * Increment the upvote count on a specific report by 1.
 */
export function incrementUpvotes(reportId) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE reports SET upvotes = upvotes + 1 WHERE id = ?`;
    db.run(sql, [reportId], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return resolve(null); // No record found
      // Return updated report
      db.get(`SELECT * FROM reports WHERE id = ?`, [reportId], (fetchErr, row) => {
        if (fetchErr) return reject(fetchErr);
        resolve(row);
      });
    });
  });
}
