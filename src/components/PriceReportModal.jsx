import { useState } from 'react';
import { submitReport } from '../services/api';

const FUEL_TYPES = ['PMS', 'AGO', 'DPK', 'LPG'];
const QUEUE_LENGTHS = ['None', 'Short', 'Moderate', 'Long'];

const DEFAULT_FORM = {
  fuel_type: 'PMS',
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
        fuel_type: form.fuel_type,
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
    <div id="report-modal-overlay" className="modal-overlay" onClick={onClose}>
      <div
        id="report-modal"
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">Report Update</h2>
            <p className="modal-subtitle">⛽ {station.name}</p>
          </div>
          <button id="modal-close-btn" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Fuel Type */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-fuel-type">Fuel Type</label>
            <div className="pill-row">
              {FUEL_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  id={`modal-fuel-${f}`}
                  className={`pill ${form.fuel_type === f ? 'pill--active' : ''}`}
                  onClick={() => set('fuel_type', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="form-group">
            <label className="form-label">Availability</label>
            <div className="toggle-row">
              <button
                type="button"
                id="modal-available-yes"
                className={`toggle-btn ${form.is_available ? 'toggle-btn--on' : ''}`}
                onClick={() => set('is_available', true)}
              >
                ✅ In Stock
              </button>
              <button
                type="button"
                id="modal-available-no"
                className={`toggle-btn ${!form.is_available ? 'toggle-btn--off' : ''}`}
                onClick={() => set('is_available', false)}
              >
                ❌ Out of Stock
              </button>
            </div>
          </div>

          {/* Price — only if available */}
          {form.is_available && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-price">Price per Litre (₦)</label>
                <div className="input-prefix-wrap">
                  <span className="input-prefix">₦</span>
                  <input
                    id="modal-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 650"
                    className="form-input"
                    value={form.price_per_litre}
                    onChange={(e) => set('price_per_litre', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-queue">Queue Length</label>
                <div className="pill-row">
                  {QUEUE_LENGTHS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      id={`modal-queue-${q}`}
                      className={`pill ${form.queue_length === q ? 'pill--active' : ''}`}
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
          {error && <p className="form-error">⚠️ {error}</p>}

          {/* Submit */}
          <button
            id="modal-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting…' : '📤 Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
