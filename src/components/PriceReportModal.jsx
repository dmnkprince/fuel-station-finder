import { useState } from 'react';
import { submitReport } from '../services/api';
import { getFuelCode } from '../utils/constants';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Kerosene', 'Cooking Gas'];
const QUEUE_LENGTHS = ['None', 'Short', 'Moderate', 'Long'];

const DEFAULT_FORM = {
  fuel_type: 'Petrol',
  is_available: true,
  price_per_litre: '',
  queue_length: 'Short',
};

export default function PriceReportModal({ station, onClose, onSuccess }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.price_per_litre && form.is_available) {
      return setError('Please enter the price per litre.');
    }

    setLoading(true);
    try {
      const payload = {
        station_id: station.id,
        fuel_type: getFuelCode(form.fuel_type), // Convert e.g. "Petrol" -> "PMS" for DB compatibility
        is_available: form.is_available,
        price_per_litre: form.is_available ? parseFloat(form.price_per_litre) : 0,
        queue_length: form.is_available ? form.queue_length : 'None',
      };
      const newReport = await submitReport(payload);
      onSuccess?.(newReport);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="report-modal-overlay" className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div
        id="report-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/50"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div>
            <h2 id="modal-title" className="text-lg font-black text-slate-100">Report Live Status</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">⛽ {station.name}</p>
          </div>
          <button 
            id="modal-close-btn" 
            className="bg-slate-800 border border-slate-700 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-900 text-slate-400 p-1.5 rounded-lg text-xs transition-all" 
            onClick={onClose} 
            aria-label="Close"
          >
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Fuel Type */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-fuel-type">Fuel Type</label>
            <div className="grid grid-cols-2 gap-2">
              {FUEL_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  id={`modal-fuel-${f.replace(/\s+/g, '-')}`}
                  className={`py-3 px-4 rounded-lg text-xs font-bold border transition-all ${
                    form.fuel_type === f
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40 hover:text-amber-500'
                  }`}
                  onClick={() => set('fuel_type', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Availability</label>
            <div className="flex gap-2">
              <button
                type="button"
                id="modal-available-yes"
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                  form.is_available
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                    : 'border-slate-800 text-slate-400 bg-slate-950'
                }`}
                onClick={() => set('is_available', true)}
              >
                ✅ In Stock
              </button>
              <button
                type="button"
                id="modal-available-no"
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                  !form.is_available
                    ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                    : 'border-slate-800 text-slate-400 bg-slate-950'
                }`}
                onClick={() => set('is_available', false)}
              >
                ❌ Out of Stock
              </button>
            </div>
          </div>

          {/* Price & Queue */}
          {form.is_available && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-price">Price per Litre (₦)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-amber-500 font-extrabold text-sm pointer-events-none">₦</span>
                  <input
                    id="modal-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 1325"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-bold outline-none focus:border-amber-500 transition-all placeholder-slate-700"
                    value={form.price_per_litre}
                    onChange={(e) => set('price_per_litre', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-queue">Queue Length</label>
                <div className="flex gap-1.5">
                  {QUEUE_LENGTHS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      id={`modal-queue-${q}`}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                        form.queue_length === q
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40 hover:text-amber-500'
                      }`}
                      onClick={() => set('queue_length', q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/35 p-3 rounded-lg font-medium">⚠️ {error}</p>}

          {/* Submit Button */}
          <button
            id="modal-submit-btn"
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10 mt-2"
            disabled={loading}
          >
            {loading ? 'Submitting…' : '📤 Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
