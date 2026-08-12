import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStationById, upvoteReport, downvoteReport } from '../services/api';
import PriceReportModal from '../components/PriceReportModal';
import { getFuelDisplay, getDistance } from '../utils/constants';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  green:  { label: 'In Stock',     emoji: '🟢', styleClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' },
  yellow: { label: 'Long Queue',   emoji: '🟡', styleClass: 'bg-amber-950/40 text-amber-400 border-amber-800/30' },
  red:    { label: 'Out of Stock', emoji: '🔴', styleClass: 'bg-rose-950/40 text-rose-400 border-rose-800/30' },
  grey:   { label: 'Stale Data',   emoji: '⚪', styleClass: 'bg-slate-900 text-slate-400 border-slate-800' },
};

function formatTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr);
  return date.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function StationDetail() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const [votedReportIds, setVotedReportIds] = useState([]);

  const { position: userPosition } = useGeolocation();
  const { isAdmin, isManager } = useAuth();
  const canSubmitReport = isAdmin || isManager;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('upvoted_reports') || '[]');
    setVotedReportIds(saved);
  }, []);

  const loadStation = () => {
    setLoading(true);
    fetchStationById(id)
      .then(setStation)
      .catch(() => setError('Station not found or server unavailable.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStation(); }, [id]);

  const handleUpvote = async (reportId) => {
    if (votedReportIds.includes(reportId)) return;

    try {
      await upvoteReport(reportId);
      const updated = [...votedReportIds, reportId];
      setVotedReportIds(updated);
      localStorage.setItem('upvoted_reports', JSON.stringify(updated));

      setToast('👍 Price update verified! Thank you for helping drivers.');
      setTimeout(() => setToast(''), 3000);
      loadStation();
    } catch {
      setToast('⚠️ Failed to verify price update.');
      setTimeout(() => setToast(''), 3000);
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

  // Distance from user to this station
  const distance = userPosition
    ? getDistance(userPosition[0], userPosition[1], station.latitude, station.longitude)
    : null;

  return (
    <div id="station-detail-page" className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
      {/* Back Link */}
      <Link to="/" id="back-to-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 transition-all w-fit">
        ← Back to Map
      </Link>

      {/* Station Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              {station.brand}
            </span>
            <h1 id="station-detail-name" className="text-lg sm:text-xl md:text-2xl font-black text-slate-100 leading-tight">
              {station.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="text-base shrink-0">📍</span>
              <span className="truncate">{station.address}</span>
            </p>

            {/* Distance badge */}
            {distance && (
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-sky-400 bg-sky-950/40 border border-sky-800/30 px-2.5 py-0.5 rounded-full">
                📏 {distance} from your location
              </span>
            )}
            {/* Get Directions */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-sky-400 bg-sky-950/40 border border-sky-800/30 px-3 py-1.5 rounded-lg hover:bg-sky-900/40 transition-all"
            >
              🧭 Get Directions
            </a>
          </div>
          <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full border w-fit shrink-0 ${cfg.styleClass}`}>
            {cfg.emoji} {cfg.label}
          </span>
        </div>

        {/* Latest report summary */}
        {latestReport && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-slate-950/60 border border-slate-950 rounded-xl p-3 sm:p-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuel Type</span>
              <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{getFuelDisplay(latestReport.fuel_type)}</span>
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verifications</span>
              <span className="text-sm font-extrabold text-slate-300">👍 {latestReport.upvotes}</span>
            </div>
          </div>
        )}

        {canSubmitReport && (
          <button
            id="btn-open-report-modal"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10"
            onClick={() => setShowModal(true)}
          >
            📤 Submit New Price &amp; Queue Update
          </button>
        )}
      </div>

      {/* History Timeline */}
      <section className="flex flex-col gap-4" id="report-history">
        <h2 className="text-sm sm:text-base font-black text-slate-200 uppercase tracking-wider">Report History</h2>

        {station.reports?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-600 border border-dashed border-slate-800 rounded-xl">
            <span className="text-4xl">📋</span>
            <p className="text-xs font-semibold">No updates reported yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {station.reports.map((r, i) => {
              const isVoted = votedReportIds.includes(r.id);

              return (
                <div
                  key={r.id}
                  id={`report-item-${r.id}`}
                  className={`p-3 sm:p-4 bg-slate-900 border rounded-xl flex flex-col gap-3 transition-all ${
                    i === 0 ? 'border-amber-500 bg-amber-500/[0.02]' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{getFuelDisplay(r.fuel_type)}</span>
                    {r.is_available ? (
                      <span className="text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 px-2.5 py-0.5 rounded-full">✅ In Stock</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-rose-950/40 text-rose-400 border border-rose-800/30 px-2.5 py-0.5 rounded-full">❌ Out of Stock</span>
                    )}
                    {r.is_official && (
                      <span className="text-[9px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ✅ Official
                      </span>
                    )}
                    {i === 0 && (
                      <span className="bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">💰 <span className="font-extrabold text-slate-200">{r.is_available ? `₦${r.price_per_litre.toLocaleString()}/L` : '—'}</span></span>
                    <span className="flex items-center gap-1">🚗 Queue: <span className="font-extrabold text-slate-200">{r.queue_length}</span></span>
                    <span className="flex items-center gap-1">🕐 {formatTime(r.created_at)}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-1 gap-2">
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      👍 <span className="text-slate-200 font-extrabold">{r.upvotes}</span> verifications
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        id={`upvote-btn-${r.id}`}
                        className={`text-xs font-extrabold px-3 sm:px-4 py-1.5 rounded-lg border transition-all ${
                          isVoted
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 cursor-default'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500 hover:text-amber-500 active:scale-95'
                        }`}
                        onClick={() => handleUpvote(r.id)}
                        disabled={isVoted}
                      >
                        {isVoted ? '✅ Verified' : '👍 Verify Update'}
                      </button>
                      <button
                        id={`flag-btn-${r.id}`}
                        className="text-xs font-extrabold px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:border-rose-500 hover:text-rose-400 active:scale-95 transition-all"
                        onClick={async () => {
                          try {
                            await downvoteReport(r.id);
                            setToast('⚠️ Report flagged as inaccurate.');
                            setTimeout(() => setToast(''), 3000);
                            loadStation();
                          } catch {
                            setToast('❌ Failed to flag report.');
                            setTimeout(() => setToast(''), 3000);
                          }
                        }}
                      >
                        🚩 Flag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
        <div id="detail-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 text-slate-100 text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-[9999] whitespace-nowrap animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
