// import { getFuelDisplay } from '../utils/constants';

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
    <div id="search-filter" className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col gap-3 shrink-0">
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

      {/* Filters (Dropdowns) */}
      <div className="flex flex-row gap-3">
        {/* Fuel Type Filter */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="filter-fuel" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuel Type</label>
          <select
            id="filter-fuel"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
            value={filters.fuelType}
            onChange={(e) => set('fuelType', e.target.value)}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f === 'All' ? '🌐 All' : f}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="filter-status" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
          <select
            id="filter-status"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? '🌐 All' : STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
