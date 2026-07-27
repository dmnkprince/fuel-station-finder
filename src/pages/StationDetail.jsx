import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStationById, upvoteReport } from '../services/api';
import PriceReportModal from '../components/PriceReportModal';

const STATUS_CONFIG = {
  green:  { label: 'In Stock',     emoji: '🟢', cls: 'badge--green'  },
  yellow: { label: 'Long Queue',   emoji: '🟡', cls: 'badge--yellow' },
  red:    { label: 'Out of Stock', emoji: '🔴', cls: 'badge--red'    },
  grey:   { label: 'Stale Data',   emoji: '⚪', cls: 'badge--grey'   },
};

function formatTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr.replace(' ', 'T') + 'Z');
  return date.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos',
  });
}

export default function StationDetail() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const loadStation = () => {
    setLoading(true);
    fetchStationById(id)
      .then(setStation)
      .catch(() => setError('Station not found or server unavailable.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStation(); }, [id]);

  const handleUpvote = async (reportId) => {
    try {
      await upvoteReport(reportId);
      setToast('👍 Upvote recorded!');
      setTimeout(() => setToast(''), 2500);
      loadStation(); // Refresh
    } catch {
      setToast('Failed to upvote.');
      setTimeout(() => setToast(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
        <p>Loading station…</p>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="detail-error">
        <p>⚠️ {error || 'Station not found.'}</p>
        <Link to="/" className="btn-primary">← Back to Map</Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG.grey;
  const latestReport = station.reports?.[0];

  return (
    <div id="station-detail-page" className="detail-page">
      {/* Back link */}
      <Link to="/" id="back-to-map" className="back-link">← Back to Map</Link>

      {/* Station hero card */}
      <div className="detail-hero">
        <div className="detail-hero-top">
          <div>
            <span className="detail-brand">{station.brand}</span>
            <h1 id="station-detail-name" className="detail-name">{station.name}</h1>
            <p className="detail-address">📍 {station.address}</p>
          </div>
          <span className={`status-badge ${cfg.cls}`}>{cfg.emoji} {cfg.label}</span>
        </div>

        {/* Latest report summary */}
        {latestReport && (
          <div className="detail-stats-grid">
            <div className="detail-stat">
              <span className="detail-stat-label">Fuel Type</span>
              <span className="detail-stat-value fuel-badge">{latestReport.fuel_type}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Price / Litre</span>
              <span className="detail-stat-value price-value">
                {latestReport.is_available ? `₦${latestReport.price_per_litre.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Queue</span>
              <span className="detail-stat-value">{latestReport.queue_length}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Community Votes</span>
              <span className="detail-stat-value">👍 {latestReport.upvotes}</span>
            </div>
          </div>
        )}

        <button
          id="btn-open-report-modal"
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          📤 Report Update
        </button>
      </div>

      {/* Report History */}
      <section className="detail-history" id="report-history">
        <h2 className="section-heading">Report History</h2>
        {station.reports?.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No reports yet for this station.</p>
          </div>
        ) : (
          <div className="history-list">
            {station.reports.map((r, i) => (
              <div
                key={r.id}
                id={`report-item-${r.id}`}
                className={`history-item ${i === 0 ? 'history-item--latest' : ''}`}
              >
                <div className="history-header">
                  <span className="fuel-badge">{r.fuel_type}</span>
                  {r.is_available ? (
                    <span className="avail-badge avail-badge--yes">✅ In Stock</span>
                  ) : (
                    <span className="avail-badge avail-badge--no">❌ Out of Stock</span>
                  )}
                  {i === 0 && <span className="latest-tag">Latest</span>}
                </div>

                <div className="history-details">
                  <span>💰 {r.is_available ? `₦${r.price_per_litre.toLocaleString()}/L` : '—'}</span>
                  <span>🚗 Queue: {r.queue_length}</span>
                  <span>🕐 {formatTime(r.created_at)}</span>
                </div>

                <div className="history-footer">
                  <span className="upvote-count">👍 {r.upvotes} upvotes</span>
                  <button
                    id={`upvote-btn-${r.id}`}
                    className="upvote-btn"
                    onClick={() => handleUpvote(r.id)}
                  >
                    Verify this report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Report Modal */}
      {showModal && (
        <PriceReportModal
          station={station}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadStation(); }}
        />
      )}

      {/* Toast */}
      {toast && <div id="detail-toast" className="toast">{toast}</div>}
    </div>
  );
}
