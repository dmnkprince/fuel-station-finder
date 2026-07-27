import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStationById, upvoteReport } from '../services/api';
import PriceReportModal from '../components/PriceReportModal';

const STATUS_CONFIG = {
  green:  { label: 'In Stock',     emoji: '🟢', styleClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' },
  yellow: { label: 'Long Queue',   emoji: '🟡', styleClass: 'bg-amber-950/40 text-amber-400 border-amber-800/30' },
  red:    { label: 'Out of Stock', emoji: '🔴', styleClass: 'bg-rose-950/40 text-rose-400 border-rose-800/30' },
  grey:   { label: 'Stale Data',   emoji: '⚪', styleClass: 'bg-slate-900 text-slate-400 border-slate-800' },
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
      loadStation();
    } catch {
      setToast('Failed to upvote.');
      setTimeout(() => setToast(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-9 h-9 border-3 border-slate-800 border-t-amber-500 rounded-full spinner-animate" />
        <p className="text-sm font-semibold">Loading station details...</p>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 p-6 text-center">
        <p className="text-base font-bold text-rose-500">⚠️ {error || 'Station not found.'}</p>
        <Link to="/" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-lg">← Back to Map</Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG.grey;
  const latestReport = station.reports?.[0];

  return (
    <div id="station-detail-page" className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Back Link */}
      <Link to="/" id="back-to-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 transition-all w-fit">
        ← Back to Map
      </Link>

      {/* Station Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              {station.brand}
            </span>
            <h1 id="station-detail-name" className="text-xl md:text-2xl font-black text-slate-100 leading-tight">
              {station.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="text-base">📍</span> {station.address}
            </p>
          </div>
          <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full border w-fit ${cfg.styleClass}`}>
            {cfg.emoji} {cfg.label}
          </span>
        </div>

        {/* Latest report summary */}
        {latestReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-950 rounded-xl p-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuel Type</span>
              <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{latestReport.fuel_type}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price / Litre</span>
              <span className="text-sm font-black text-slate-100">
                {latestReport.is_available ? `₦${latestReport.price_per_litre.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Queue</span>
              <span className="text-sm font-bold text-slate-200">{latestReport.queue_length}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Votes</span>
              <span className="text-sm font-extrabold text-slate-300">👍 {latestReport.upvotes}</span>
            </div>
          </div>
        )}

        <button
          id="btn-open-report-modal"
          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10"
          onClick={() => setShowModal(true)}
        >
          📤 Report Station Update
        </button>
      </div>

      {/* History Timeline */}
      <section className="flex flex-col gap-4" id="report-history">
        <h2 className="text-base font-black text-slate-200 uppercase tracking-wider">Report History</h2>
        
        {station.reports?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-600 border border-dashed border-slate-800 rounded-xl">
            <span className="text-4xl">📋</span>
            <p className="text-xs font-semibold">No updates reported yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {station.reports.map((r, i) => (
              <div
                key={r.id}
                id={`report-item-${r.id}`}
                className={`p-4 bg-slate-900 border rounded-xl flex flex-col gap-3 transition-all ${
                  i === 0 ? 'border-amber-500 bg-amber-500/[0.02]' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{r.fuel_type}</span>
                  {r.is_available ? (
                    <span className="text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 px-2.5 py-0.5 rounded-full">✅ In Stock</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-rose-950/40 text-rose-400 border border-rose-800/30 px-2.5 py-0.5 rounded-full">❌ Out of Stock</span>
                  )}
                  {i === 0 && (
                    <span className="bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                      Latest
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">💰 <span className="font-extrabold text-slate-200">{r.is_available ? `₦${r.price_per_litre.toLocaleString()}/L` : '—'}</span></span>
                  <span className="flex items-center gap-1">🚗 Queue: <span className="font-extrabold text-slate-200">{r.queue_length}</span></span>
                  <span className="flex items-center gap-1">🕐 {formatTime(r.created_at)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
                  <span className="text-xs text-slate-500 font-bold">👍 <span className="text-slate-300">{r.upvotes}</span> verified votes</span>
                  <button
                    id={`upvote-btn-${r.id}`}
                    className="text-xs font-extrabold bg-slate-800 border border-slate-700 hover:border-amber-500 hover:text-amber-500 px-3.5 py-1.5 rounded-lg transition-all"
                    onClick={() => handleUpvote(r.id)}
                  >
                    Verify this update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <PriceReportModal
          station={station}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadStation(); }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div id="detail-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 text-slate-100 text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-[9999] whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
