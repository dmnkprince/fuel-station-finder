import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitReport, fetchMyStations } from '../services/api';
import { getFuelCode } from '../utils/constants';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Kerosene', 'Cooking Gas'];
const QUEUE_LENGTHS = ['None', 'Short', 'Moderate', 'Long'];

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [toast, setToast] = useState('');
  const [assignedStations, setAssignedStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [form, setForm] = useState({
    fuel_type: 'Petrol',
    is_available: true,
    price_per_litre: '',
    queue_length: 'Short',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    loadStations();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredStations = assignedStations.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.brand.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query)
    );
  });

  const loadStations = async () => {
    setStationsLoading(true);
    try {
      const data = await fetchMyStations();
      setAssignedStations(data);
      if (data.length === 1) {
        setSelectedStation(data[0]);
      }
    } catch (err) {
      console.error('Failed to load assigned stations:', err);
    } finally {
      setStationsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStation) {
      return setError('Please select a station to update.');
    }
    if (!form.price_per_litre && form.is_available) {
      return setError('Please enter the price per litre.');
    }

    setLoading(true);
    try {
      await submitReport({
        station_id: selectedStation.id,
        fuel_type: getFuelCode(form.fuel_type),
        is_available: form.is_available,
        price_per_litre: form.is_available ? parseFloat(form.price_per_litre) : 0,
        queue_length: form.is_available ? form.queue_length : 'None',
      });
      showToast('✅ Official update posted successfully!');
      setForm({ fuel_type: 'Petrol', is_available: true, price_per_litre: '', queue_length: 'Short' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="manager-dashboard" className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 transition-all w-fit">
        ← Back to Map
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-3xl">⛽</span>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100">Station Manager</h1>
          <p className="text-xs text-slate-500 font-medium">Welcome, {user?.name} • Post official updates</p>
        </div>
      </div>

      {stationsLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
          <div className="w-9 h-9 border-3 border-slate-800 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-semibold">Loading your stations...</p>
        </div>
      ) : assignedStations.length === 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-6 text-center">
          <span className="text-3xl block mb-3">⚠️</span>
          <h2 className="text-base font-black text-slate-100">No Stations Assigned</h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">Your account hasn't been assigned to any station yet. Please contact the admin to link your account.</p>
        </div>
      ) : (
        <>
          {/* Station Selector (only if multiple stations) */}
          {assignedStations.length > 1 && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Station</label>
              
              <div className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-medium text-left outline-none focus:border-amber-500 transition-all text-sm cursor-pointer"
                >
                  {selectedStation ? (
                    <div>
                      <span className="text-sm font-bold block">{selectedStation.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">{selectedStation.brand} • {selectedStation.address}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">Choose a station...</span>
                  )}
                  <span className="text-amber-500 text-xs ml-2">{isDropdownOpen ? '▲' : '▼'}</span>
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-850 rounded-lg shadow-2xl z-50 flex flex-col max-h-[340px] overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2.5 border-b border-slate-800 bg-slate-900">
                      <input
                        type="text"
                        placeholder="🔍 Search station name, brand or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 text-xs font-medium outline-none focus:border-amber-500 transition-all placeholder-slate-700"
                        autoFocus
                      />
                    </div>

                    {/* Scrollable list */}
                    <div className="overflow-y-auto flex-1">
                      {filteredStations.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs font-medium text-slate-500">
                          No matching stations found
                        </div>
                      ) : (
                        filteredStations.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className={`w-full p-3 text-left border-b border-slate-900/60 hover:bg-slate-900 transition-all flex flex-col cursor-pointer ${
                              selectedStation?.id === s.id ? 'bg-amber-500/10 text-slate-100 border-l-2 border-l-amber-500' : 'text-slate-400'
                            }`}
                            onClick={() => {
                              setSelectedStation(s);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <span className="text-xs font-bold block">{s.name}</span>
                            <span className="text-[9px] font-medium text-slate-500 mt-0.5 block">{s.brand} • {s.address}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Post Update Form */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-100">📤 Post Official Update</h2>
              <span className="text-[9px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Official</span>
            </div>

            {selectedStation && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5">
                <p className="text-sm font-bold text-slate-200">{selectedStation.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{selectedStation.brand} • {selectedStation.address}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Fuel Type */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fuel Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {FUEL_TYPES.map((f) => (
                    <button key={f} type="button"
                      className={`py-3 px-4 rounded-lg text-xs font-bold border transition-all ${
                        form.fuel_type === f
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40'
                      }`}
                      onClick={() => set('fuel_type', f)}
                    >{f}</button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Availability</label>
                <div className="flex gap-2">
                  <button type="button"
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                      form.is_available ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'border-slate-800 text-slate-400 bg-slate-950'
                    }`}
                    onClick={() => set('is_available', true)}
                  >✅ In Stock</button>
                  <button type="button"
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                      !form.is_available ? 'border-rose-500 text-rose-400 bg-rose-950/20' : 'border-slate-800 text-slate-400 bg-slate-950'
                    }`}
                    onClick={() => set('is_available', false)}
                  >❌ Out of Stock</button>
                </div>
              </div>

              {/* Price & Queue */}
              {form.is_available && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price per Litre (₦)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-amber-500 font-extrabold text-sm pointer-events-none">₦</span>
                      <input type="number" min="0" step="0.01" placeholder="e.g. 1325"
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-bold outline-none focus:border-amber-500 transition-all placeholder-slate-700"
                        value={form.price_per_litre}
                        onChange={(e) => set('price_per_litre', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Queue Length</label>
                    <div className="flex gap-1.5">
                      {QUEUE_LENGTHS.map((q) => (
                        <button key={q} type="button"
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                            form.queue_length === q
                              ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40'
                          }`}
                          onClick={() => set('queue_length', q)}
                        >{q}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {error && <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/35 p-3 rounded-lg font-medium">⚠️ {error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10">
                {loading ? 'Posting…' : '📤 Post Official Update'}
              </button>
            </form>
          </section>
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 text-slate-100 text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-[9999] whitespace-nowrap animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
