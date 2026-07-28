import { useEffect, useState, useMemo } from 'react';
import { fetchStations } from '../services/api';
import StationMap from '../components/StationMap';
import StationCard from '../components/StationCard';
import SearchFilter from '../components/SearchFilter';
import PriceReportModal from '../components/PriceReportModal';
import { getFuelDisplay } from '../utils/constants';

const DEFAULT_FILTERS = { search: '', fuelType: 'All', status: 'All' };

export default function Home() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [reportStation, setReportStation] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch(() => setError('Failed to load stations. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('❌ Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        showToast('📍 Map centered on your location.');
      },
      () => {
        showToast('⚠️ Could not fetch your location. Please check your permissions.');
      }
    );
  };

  useEffect(() => {
    handleLocateUser();
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const searchMatch =
        filters.search === '' ||
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.brand.toLowerCase().includes(filters.search.toLowerCase());

      const fuelMatch =
        filters.fuelType === 'All' ||
        getFuelDisplay(s.latest_report?.fuel_type) === filters.fuelType;

      const statusMatch =
        filters.status === 'All' || s.status === filters.status;

      return searchMatch && fuelMatch && statusMatch;
    });
  }, [stations, filters]);

  const handleReportSuccess = (newReport) => {
    fetchStations().then(setStations);
    showToast('✅ Report submitted successfully! Thank you.');
  };

  return (
    <div id="home-page" className="flex-1 flex flex-col md:flex-row overflow-hidden relative w-full h-full">
      {/* Map Section */}
      <div className="flex-1 relative bg-slate-950 min-h-[50vh] md:min-h-0">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10">
            <div className="w-9 h-9 border-3 border-slate-800 border-t-amber-500 rounded-full spinner-animate" />
            <p className="text-sm font-semibold">Loading map data...</p>
          </div>
        )}
        {error && <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold z-10">⚠️ {error}</div>}
        {!loading && !error && (
          <StationMap
            stations={filteredStations}
            userPosition={userPosition}
            selectedStation={selectedStation}
            onMarkerClick={setSelectedStation}
            onUpvoteSuccess={() => fetchStations().then(setStations)}
            onLocateUser={handleLocateUser}
          />
        )}
      </div>

      {/* Sidebar Section */}
      <aside id="home-sidebar" className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 flex flex-col flex-shrink-0 h-[50vh] md:h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider">
            Fuel Stations
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">{filteredStations.length}</span>
          </h2>
          <button
            id="btn-report-hero"
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all shadow-md"
            onClick={() => setReportStation(selectedStation ?? stations[0])}
            disabled={stations.length === 0}
          >
            + Report Update
          </button>
        </div>

        <SearchFilter filters={filters} onChange={setFilters} />

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" id="station-list">
          {filteredStations.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-500 text-center">
              <span className="text-3xl">🔍</span>
              <p className="text-xs font-semibold">No stations match filters.</p>
            </div>
          )}
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isHighlighted={selectedStation?.id === station.id}
              onClick={() => setSelectedStation(station)}
              onUpvoteSuccess={() => fetchStations().then(setStations)}
            />
          ))}
        </div>
      </aside>

      {/* Report Modal */}
      {reportStation && (
        <PriceReportModal
          station={reportStation}
          onClose={() => setReportStation(null)}
          onSuccess={handleReportSuccess}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div id="toast-message" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 text-slate-100 text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-[9999] whitespace-nowrap animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
