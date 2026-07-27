const FUEL_TYPES = ['All', 'PMS', 'AGO', 'DPK', 'LPG'];
const STATUSES = ['All', 'green', 'yellow', 'red', 'grey'];

const STATUS_LABELS = {
  green: '🟢 In Stock',
  yellow: '🟡 Long Queue',
  red: '🔴 Out of Stock',
  grey: '⚪ Stale',
};

export default function SearchFilter({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div id="search-filter" className="filter-panel">
      {/* Search box */}
      <div className="filter-search-wrap">
        <span className="filter-search-icon">🔍</span>
        <input
          id="filter-search-input"
          type="text"
          placeholder="Search station name or area…"
          className="filter-search-input"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      {/* Fuel type pills */}
      <div className="filter-group">
        <span className="filter-label">Fuel Type</span>
        <div className="pill-row">
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              id={`filter-fuel-${f}`}
              className={`pill ${filters.fuelType === f ? 'pill--active' : ''}`}
              onClick={() => set('fuelType', f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Status pills */}
      <div className="filter-group">
        <span className="filter-label">Status</span>
        <div className="pill-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              id={`filter-status-${s}`}
              className={`pill ${filters.status === s ? 'pill--active' : ''}`}
              onClick={() => set('status', s)}
            >
              {s === 'All' ? '🌐 All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
