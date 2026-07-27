import { useEffect, useState, useMemo } from 'react';
import { fetchStations } from '../services/api';
import StationMap from '../components/StationMap';
import StationCard from '../components/StationCard';
import SearchFilter from '../components/SearchFilter';
import PriceReportModal from '../components/PriceReportModal';

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

  // Fetch stations
  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch(() => setError('Failed to load stations. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  // Request GPS
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {} // silently fail — fall back to Nigeria default
    );
  }, []);

  // Show toast for 3 seconds
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Apply filters
  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const searchMatch =
        filters.search === '' ||
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.brand.toLowerCase().includes(filters.search.toLowerCase());

      const fuelMatch =
        filters.fuelType === 'All' ||
        s.latest_report?.fuel_type === filters.fuelType;

      const statusMatch =
        filters.status === 'All' || s.status === filters.status;

      return searchMatch && fuelMatch && statusMatch;
    });
  }, [stations, filters]);

  const handleReportSuccess = (newReport) => {
    // Refresh station list to pick up new report
    fetchStations().then(setStations);
    showToast('✅ Report submitted successfully! Thank you.');
  };

  return (
    <div id="home-page" className="home-layout">
      {/* Map — takes most of the screen */}
      <div className="map-section">
        {loading && (
          <div className="map-loading">
            <div className="spinner" />
            <p>Loading stations…</p>
          </div>
        )}
        {error && <div className="map-error">⚠️ {error}</div>}
        {!loading && !error && (
          <StationMap
            stations={filteredStations}
            userPosition={userPosition}
            selectedStation={selectedStation}
            onMarkerClick={setSelectedStation}
          />
        )}
      </div>

      {/* Sidebar */}
      <aside id="home-sidebar" className="home-sidebar">
        <div className="sidebar-top">
          <h2 className="sidebar-heading">
            Fuel Stations
            <span className="sidebar-count">{filteredStations.length}</span>
          </h2>
          <button
            id="btn-report-hero"
            className="btn-primary btn-sm"
            onClick={() => setReportStation(selectedStation ?? stations[0])}
            disabled={stations.length === 0}
          >
            + Report Update
          </button>
        </div>

        <SearchFilter filters={filters} onChange={setFilters} />

        <div className="station-list" id="station-list">
          {filteredStations.length === 0 && !loading && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No stations match your filters.</p>
            </div>
          )}
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isHighlighted={selectedStation?.id === station.id}
              onClick={() => setSelectedStation(station)}
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

      {/* Toast notification */}
      {toast && <div id="toast-message" className="toast">{toast}</div>}
    </div>
  );
}
