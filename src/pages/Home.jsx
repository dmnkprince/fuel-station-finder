import { useEffect, useState, useMemo } from "react";
import { fetchStations } from "../services/api";
import StationMap from "../components/StationMap";
import StationCard from "../components/StationCard";
import SearchFilter from "../components/SearchFilter";
import PriceReportModal from "../components/PriceReportModal";
import { getFuelDisplay } from "../utils/constants";
import { useGeolocation } from "../hooks/useGeolocation";
import { CheckCircle2, XCircle, MapPin, AlertTriangle, Search } from 'lucide-react';

const DEFAULT_FILTERS = { search: "", fuelType: "All", status: "All" };

export default function Home() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [reportStation, setReportStation] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [toast, setToast] = useState(null);

  const {
    position: userPosition,
    error: geoError,
    recenter,
    flyToSignal,
  } = useGeolocation();

  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch(() => setError("Failed to load stations. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLocateUser = () => {
    if (geoError) {
      showToast(geoError, "error");
    } else {
      showToast("Map centered on your location.", "info");
    }
    recenter();
  };

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const searchMatch =
          filters.search === "" ||
          s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.address.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.brand.toLowerCase().includes(filters.search.toLowerCase());

      const fuelMatch =
          filters.fuelType === "All" ||
          getFuelDisplay(s.latest_report?.fuel_type) === filters.fuelType;

      const statusMatch =
          filters.status === "All" || s.status === filters.status;

      return searchMatch && fuelMatch && statusMatch;
    });
  }, [stations, filters]);

  const handleReportSuccess = () => {
    fetchStations().then(setStations);
    showToast("Report submitted successfully! Thank you.", "success");
  };

  return (
    <div
      id="home-page"
      className="flex-1 flex flex-col md:flex-row overflow-hidden relative w-full h-full"
    >
      {/* Map Section */}
      <div className="flex-1 relative bg-slate-950 min-h-[45vh] md:min-h-0">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10">
            <div className="w-9 h-9 border-3 border-slate-800 border-t-amber-500 rounded-full spinner-animate" />
            <p className="text-sm font-semibold">Loading map data...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold z-10 px-4 text-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}
        {!loading && !error && (
          <StationMap
            stations={filteredStations}
            userPosition={userPosition}
            flyToSignal={flyToSignal}
            selectedStation={selectedStation}
            onMarkerClick={setSelectedStation}
            onUpvoteSuccess={() => fetchStations().then(setStations)}
            onLocateUser={handleLocateUser}
          />
        )}
      </div>
      {/* Sidebar Section */}
      <aside
        id="home-sidebar"
        className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 h-[55vh] md:h-full overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b border-slate-800 shrink-0 gap-2">
          <h2 className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider">
            Fuel Stations
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
              {filteredStations.length}
            </span>
          </h2>
          <button
            id="btn-report-hero"
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all shadow-md shrink-0 cursor-pointer"
            onClick={() => setReportStation(selectedStation ?? stations[0])}
            disabled={stations.length === 0}
          >
            + Report Update
          </button>
        </div>

        <SearchFilter filters={filters} onChange={setFilters} />

        <div
          className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2.5"
          id="station-list"
        >
          {filteredStations.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center gap-2.5 py-10 text-slate-500 text-center">
              <Search className="w-8 h-8 text-slate-500" />
              <p className="text-xs font-semibold">
                No stations match filters.
              </p>
            </div>
          )}
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isHighlighted={selectedStation?.id === station.id}
              onClick={() => setSelectedStation(station)}
              onUpvoteSuccess={() => fetchStations().then(setStations)}
              userPosition={userPosition}
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
        <div
          id="toast-message"
          className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-slate-100 text-xs font-bold px-5 py-3 rounded-xl shadow-2xl z-[9999] whitespace-nowrap flex items-center gap-2 animate-bounce animate-duration-300"
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === "error" && <XCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === "info" && <MapPin className="w-4 h-4 text-sky-400" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
