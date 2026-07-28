import { getFuelDisplay } from '../utils/constants';

const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'Kerosene', 'Cooking Gas'];
const STATUSES = ['All', 'green', 'yellow', 'red', 'grey'];

const STATUS_LABELS = {
  green: '🟢 In Stock',
  yellow: '🟡 Queue',
  red: '🔴 No Stock',
  grey: '⚪ Stale',
};

export default function SearchFilter({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div id="search-filter" className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col gap-3 flex-shrink-0">
      {/* Search Input */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-slate-500 text-sm pointer-events-none">🔍</span>
        <input
          id="filter-search-input"
          type="text"
          placeholder="Search name, brand, or area..."
          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm font-medium placeholder-slate-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      {/* Fuel Type Filters */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuel Type</span>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              id={`filter-fuel-${f.replace(/\s+/g, '-')}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filters.fuelType === f
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40 hover:text-amber-500'
              }`}
              onClick={() => set('fuelType', f)}
            >
              {f === 'All' ? '🌐 All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              id={`filter-status-${s}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filters.status === s
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40 hover:text-amber-500'
              }`}
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
