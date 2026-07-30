import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { upvoteReport } from '../services/api';
import { getFuelDisplay, getDistance } from '../utils/constants';

const STATUS_CONFIG = {
  green:  { dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',  label: 'In Stock',     emoji: '🟢', styleClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' },
  yellow: { dot: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',    label: 'Long Queue',   emoji: '🟡', styleClass: 'bg-amber-950/40 text-amber-400 border-amber-800/30' },
  red:    { dot: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',      label: 'Out of Stock', emoji: '🔴', styleClass: 'bg-rose-950/40 text-rose-400 border-rose-800/30' },
  grey:   { dot: 'bg-slate-500',                              label: 'Stale Data',   emoji: '⚪', styleClass: 'bg-slate-900 text-slate-400 border-slate-800' },
};

const QUEUE_ICONS = { None: '—', Short: '🚗', Moderate: '🚗🚗', Long: '🚗🚗🚗' };

export default function StationCard({ station, onClick, isHighlighted, onUpvoteSuccess, userPosition }) {
  const cfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG.grey;
  const report = station.latest_report;

  const [upvotes, setUpvotes] = useState(report?.upvotes ?? 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    setUpvotes(report?.upvotes ?? 0);
    if (report?.id) {
      const votedList = JSON.parse(localStorage.getItem('upvoted_reports') || '[]');
      setHasVoted(votedList.includes(report.id));
    }
  }, [report]);

  const handleQuickUpvote = async (e) => {
    e.stopPropagation();
    if (!report?.id || hasVoted || isUpvoting) return;

    setIsUpvoting(true);
    setUpvotes((prev) => prev + 1);
    setHasVoted(true);

    try {
      await upvoteReport(report.id);
      const votedList = JSON.parse(localStorage.getItem('upvoted_reports') || '[]');
      if (!votedList.includes(report.id)) {
        votedList.push(report.id);
        localStorage.setItem('upvoted_reports', JSON.stringify(votedList));
      }
      onUpvoteSuccess?.();
    } catch {
      // Revert if failed
      setUpvotes((prev) => prev - 1);
      setHasVoted(false);
    } finally {
      setIsUpvoting(false);
    }
  };

  // Compute distance if user position is available
  const distance = userPosition
    ? getDistance(userPosition[0], userPosition[1], station.latitude, station.longitude)
    : null;

  // Build list of fuel products: prefer reports array (grouped by fuel type), fall back to latest_report
  const fuelRows = (() => {
    if (station.reports && station.reports.length > 0) {
      // Group by fuel type, keep the latest per type
      const map = {};
      for (const r of station.reports) {
        if (!map[r.fuel_type]) map[r.fuel_type] = r;
      }
      return Object.values(map);
    }
    return report ? [report] : [];
  })();

  return (
    <div
      id={`station-card-${station.id}`}
      className={`p-3 sm:p-4 bg-slate-900 border rounded-xl flex flex-col gap-2.5 transition-all cursor-pointer select-none active:scale-[0.99] outline-none ${
        isHighlighted
          ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/35 shadow-lg shadow-amber-500/5'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full block shrink-0 ${cfg.dot}`} title={cfg.label} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{station.brand}</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${cfg.styleClass}`}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      {/* Main Info */}
      <div>
        <h3 className="font-bold text-sm text-slate-100 leading-tight">{station.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <span className="text-sm shrink-0">📍</span>
          <span className="truncate">{station.address}</span>
        </p>
      </div>

      {/* Fuel Products Grid */}
      {fuelRows.length > 0 ? (
        <div className="bg-slate-950/60 border border-slate-900 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-0 text-center border-b border-slate-800/60">
            {['Fuel', 'Price', 'Queue', 'Updated'].map((h) => (
              <span key={h} className="text-[9px] font-bold text-slate-500 uppercase tracking-wide py-1.5 px-1">{h}</span>
            ))}
          </div>
          {/* Data rows */}
          {fuelRows.map((r, i) => (
            <div
              key={r.id ?? r.fuel_type ?? i}
              className={`grid grid-cols-4 gap-0 text-center ${i < fuelRows.length - 1 ? 'border-b border-slate-800/40' : ''}`}
            >
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded leading-tight" title={getFuelDisplay(r.fuel_type)}>
                  {getFuelDisplay(r.fuel_type)}
                </span>
              </div>
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[10px] font-black text-slate-100">
                  {r.is_available ? `₦${r.price_per_litre.toLocaleString()}` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[10px] font-bold text-slate-200">{QUEUE_ICONS[r.queue_length] ?? r.queue_length}</span>
              </div>
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[10px] font-medium text-slate-400">{r.minutes_ago}m</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic mt-1 font-medium">No reports yet — submit an update!</p>
      )}

      {/* Footer / Quick Verify + Distance Row */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 mt-0.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {report ? (
            <button
              id={`verify-btn-${station.id}`}
              className={`text-[10px] font-extrabold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                hasVoted
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 cursor-default'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500 hover:text-amber-500 active:scale-95'
              }`}
              onClick={handleQuickUpvote}
              disabled={hasVoted || isUpvoting}
              title={hasVoted ? 'You verified this price update' : 'Click to verify & upvote this price update'}
            >
              {hasVoted ? '✅ Verified' : '👍 Verify'}
              <span className="bg-slate-950 px-1 py-0.5 text-[9px] rounded text-slate-300 font-bold">{upvotes}</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">No votes yet</span>
          )}

          {distance && (
            <span className="text-[10px] font-bold text-sky-400 bg-sky-950/40 border border-sky-800/30 px-2 py-0.5 rounded-full truncate">
              📍 {distance}
            </span>
          )}
        </div>

        <Link
          to={`/stations/${station.id}`}
          id={`view-details-${station.id}`}
          className="text-[10px] font-bold text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-0.5 transition-all shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          Details →
        </Link>
      </div>
    </div>
  );
}
