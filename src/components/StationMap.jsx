import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { upvoteReport } from '../services/api';
import { getFuelDisplay, getDistance } from '../utils/constants';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import 'leaflet/dist/leaflet.css';

const STATUS_COLORS = {
  green:  { color: '#10b981', fillColor: '#059669' },
  yellow: { color: '#f59e0b', fillColor: '#d97706' },
  red:    { color: '#f43f5e', fillColor: '#e11d48' },
  grey:   { color: '#64748b', fillColor: '#475569' },
};

// Custom Leaflet DivIcon for pulsing user GPS dot
const userLocationIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-user-location-icon',
  html: '<span class="user-location-pulse"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
}) : null;

function FlyToUser({ position, flyToSignal }) {
  const map = useMap();
  const prevSignal = useRef(0);

  useEffect(() => {
    if (position && flyToSignal > prevSignal.current) {
      map.flyTo(position, 14, { duration: 1.5 });
      prevSignal.current = flyToSignal;
    }
  }, [flyToSignal, position, map]);

  return null;
}

function FlyToStation({ station }) {
  const map = useMap();
  useEffect(() => {
    if (station) map.flyTo([station.latitude, station.longitude], 15, { duration: 1 });
  }, [station, map]);
  return null;
}

function MapPopupContent({ station, onUpvote, userPosition }) {
  const report = station.latest_report;

  const [upvotes, setUpvotes] = useState(report?.upvotes ?? 0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setUpvotes(report?.upvotes ?? 0);
    if (report?.id) {
      const votedList = JSON.parse(localStorage.getItem('upvoted_reports') || '[]');
      setHasVoted(votedList.includes(report.id));
    }
  }, [report]);

  const handlePopupUpvote = async () => {
    if (!report?.id || hasVoted) return;

    setUpvotes((p) => p + 1);
    setHasVoted(true);

    try {
      await upvoteReport(report.id);
      const votedList = JSON.parse(localStorage.getItem('upvoted_reports') || '[]');
      if (!votedList.includes(report.id)) {
        votedList.push(report.id);
        localStorage.setItem('upvoted_reports', JSON.stringify(votedList));
      }
      onUpvote?.();
    } catch {
      setUpvotes((p) => p - 1);
      setHasVoted(false);
    }
  };

  // Build fuel rows: group reports by fuel_type, keep latest per type
  const fuelRows = (() => {
    if (station.reports && station.reports.length > 0) {
      const map = {};
      for (const r of station.reports) {
        if (!map[r.fuel_type]) map[r.fuel_type] = r;
      }
      return Object.values(map);
    }
    return report ? [report] : [];
  })();

  // Distance from user
  const distance = userPosition
    ? getDistance(userPosition[0], userPosition[1], station.latitude, station.longitude)
    : null;

  return (
    <div className="p-3 flex flex-col gap-1.5 min-w-[220px] max-w-[280px]">
      {/* Station name + brand */}
      <div>
        <strong className="text-slate-100 font-extrabold text-sm block leading-tight">{station.name}</strong>
        <div className="flex items-center justify-between mt-0.5 gap-2">
          <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">{station.brand}</span>
          {distance && (
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 border border-sky-800/30 px-1.5 py-0.5 rounded-full">
              📍 {distance}
            </span>
          )}
        </div>
      </div>

      {/* Fuel products table */}
      {fuelRows.length > 0 ? (
        <div className="border-t border-slate-800/80 pt-2 mt-1 flex flex-col gap-0 bg-slate-950/50 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 text-center border-b border-slate-800/60">
            {['Fuel', 'Price', 'Updated'].map((h) => (
              <span key={h} className="text-[8px] font-bold text-slate-500 uppercase tracking-wide py-1">{h}</span>
            ))}
          </div>
          {/* Rows per fuel type */}
          {fuelRows.map((r, i) => (
            <div
              key={r.id ?? r.fuel_type ?? i}
              className={`grid grid-cols-3 text-center ${i < fuelRows.length - 1 ? 'border-b border-slate-800/40' : ''}`}
            >
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded leading-tight">
                  {getFuelDisplay(r.fuel_type)}
                </span>
              </div>
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[10px] font-black text-slate-100">
                  {r.is_available ? `₦${r.price_per_litre.toLocaleString()}/L` : 'Out'}
                </span>
              </div>
              <div className="flex items-center justify-center py-1.5 px-1">
                <span className="text-[9px] font-medium text-slate-400">{formatTimeAgo(r.minutes_ago)} ago</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-slate-500 font-medium text-xs italic block mt-2">No reports yet</span>
      )}

      {/* Upvote button (based on latest_report) */}
      {report && (
        <button
          className={`w-full text-xs font-extrabold py-1.5 px-3 rounded-lg border transition-all mt-1 ${
            hasVoted
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 cursor-default'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500 hover:text-amber-500 active:scale-95'
          }`}
          onClick={handlePopupUpvote}
          disabled={hasVoted}
        >
          {hasVoted ? '✅ Verified' : `👍 Verify Price (${upvotes})`}
        </button>
      )}

      <Link
        to={`/stations/${station.id}`}
        className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline border-t border-slate-800/80 pt-2 mt-1 text-center block"
      >
        View Station Details →
      </Link>
    </div>
  );
}

export default function StationMap({ stations, userPosition, flyToSignal, selectedStation, onMarkerClick, onUpvoteSuccess, onLocateUser }) {
  // Default map view showing all of Nigeria
  const defaultCenter = [9.05, 7.5];
  const defaultZoom = 6;

  return (
    <div id="station-map-container" className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && <FlyToUser position={userPosition} flyToSignal={flyToSignal} />}
        {selectedStation && <FlyToStation station={selectedStation} />}

        {/* Pulsing GPS dot for user position */}
        {userPosition && userLocationIcon && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup className="station-popup">
              <div className="p-3 text-center min-w-[120px]">
                <strong className="text-slate-100 font-extrabold text-sm block">📍 You are here</strong>
                <span className="text-slate-400 text-[10px] font-medium block mt-1">Your current location</span>
              </div>
            </Popup>
          </Marker>
        )}

        {stations.map((station) => {
          const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.grey;

          return (
            <CircleMarker
              key={station.id}
              center={[station.latitude, station.longitude]}
              radius={12}
              pathOptions={{ ...colors, fillOpacity: 0.85, weight: 2 }}
              eventHandlers={{ click: () => onMarkerClick?.(station) }}
            >
              <Popup className="station-popup">
                <MapPopupContent
                  station={station}
                  onUpvote={onUpvoteSuccess}
                  userPosition={userPosition}
                />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Center on Me locator button */}
      <button
        id="btn-center-user"
        onClick={onLocateUser}
        className="absolute bottom-6 right-6 z-[1000] bg-slate-900 hover:bg-slate-800 text-slate-100 p-3.5 rounded-full border border-slate-800 shadow-2xl active:scale-95 transition-all flex items-center justify-center group"
        title="Center on my location"
      >
        <svg
          className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-all"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
        </svg>
      </button>
    </div>
  );
}
