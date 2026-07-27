import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  green:  { dot: 'dot--green',  label: 'In Stock',      emoji: '🟢' },
  yellow: { dot: 'dot--yellow', label: 'Long Queue',    emoji: '🟡' },
  red:    { dot: 'dot--red',    label: 'Out of Stock',  emoji: '🔴' },
  grey:   { dot: 'dot--grey',   label: 'Stale Data',    emoji: '⚪' },
};

const QUEUE_ICONS = { None: '—', Short: '🚗', Moderate: '🚗🚗', Long: '🚗🚗🚗' };

export default function StationCard({ station, onClick, isHighlighted }) {
  const cfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG.grey;
  const report = station.latest_report;

  return (
    <div
      id={`station-card-${station.id}`}
      className={`station-card ${isHighlighted ? 'station-card--highlighted' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Header row */}
      <div className="card-header">
        <div className="card-brand-wrap">
          <span className={`status-dot ${cfg.dot}`} title={cfg.label} />
          <span className="card-brand">{station.brand}</span>
        </div>
        <span className="card-status-badge" style={{ background: `var(--status-${station.status}-bg)`, color: `var(--status-${station.status})` }}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      {/* Station name */}
      <h3 className="card-name">{station.name}</h3>
      <p className="card-address">📍 {station.address}</p>

      {/* Report info */}
      {report ? (
        <div className="card-report">
          <div className="card-stat">
            <span className="stat-label">Fuel</span>
            <span className="stat-value fuel-badge">{report.fuel_type}</span>
          </div>
          <div className="card-stat">
            <span className="stat-label">Price</span>
            <span className="stat-value price-value">
              {report.is_available ? `₦${report.price_per_litre.toLocaleString()}/L` : '—'}
            </span>
          </div>
          <div className="card-stat">
            <span className="stat-label">Queue</span>
            <span className="stat-value">{QUEUE_ICONS[report.queue_length] ?? report.queue_length}</span>
          </div>
          <div className="card-stat">
            <span className="stat-label">Updated</span>
            <span className="stat-value time-ago">{report.minutes_ago}m ago</span>
          </div>
        </div>
      ) : (
        <p className="card-no-report">No reports yet — be the first!</p>
      )}

      <div className="card-footer">
        <span className="card-upvotes" title="Community upvotes">
          👍 {report?.upvotes ?? 0}
        </span>
        <Link
          to={`/stations/${station.id}`}
          id={`view-details-${station.id}`}
          className="card-details-link"
          onClick={(e) => e.stopPropagation()}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
