import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { upvoteReport } from '../services/api';
import 'leaflet/dist/leaflet.css';

const STATUS_COLORS = {
  green:  { color: '#10b981', fillColor: '#059669' },
  yellow: { color: '#f59e0b', fillColor: '#d97706' },
  red:    { color: '#f43f5e', fillColor: '#e11d48' },
  grey:   { color: '#64748b', fillColor: '#475569' },
};

function FlyToUser({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 1.5 });
  }, [position, map]);
  return null;
}

function FlyToStation({ station }) {
  const map = useMap();
  useEffect(() => {
    if (station) map.flyTo([station.latitude, station.longitude], 15, { duration: 1 });
  }, [station, map]);
  return null;
}

function MapPopupContent({ station, report, onUpvote }) {
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

  return (
    <div className="p-4 flex flex-col gap-1 min-w-[210px]">
      <strong className="text-slate-100 font-extrabold text-sm block leading-tight">{station.name}</strong>
      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">{station.brand}</span>
      
      {report ? (
        <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-500 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded">{report.fuel_type}</span>
            <span className="text-slate-400 font-medium text-[10px]">{report.minutes_ago}m ago</span>
          </div>
          <span className="text-lg font-black text-slate-100 mt-0.5">
            {report.is_available ? `₦${report.price_per_litre.toLocaleString()}/L` : 'Out of Stock'}
          </span>
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
        </div>
      ) : (
        <span className="text-slate-500 font-medium text-xs italic block mt-2">No reports yet</span>
      )}
      
      <Link 
        to={`/stations/${station.id}`} 
        className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline border-t border-slate-800/80 pt-2 mt-2 text-center"
      >
        View Station Details →
      </Link>
    </div>
  );
}

export default function StationMap({ stations, userPosition, selectedStation, onMarkerClick, onUpvoteSuccess }) {
  // Default map view centered on Yenagoa, Bayelsa State
  const defaultCenter = [4.927, 6.295];
  const defaultZoom = 13;

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

        {userPosition && <FlyToUser position={userPosition} />}
        {selectedStation && <FlyToStation station={selectedStation} />}

        {userPosition && (
          <CircleMarker
            center={userPosition}
            radius={10}
            pathOptions={{ color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.9, weight: 3 }}
          >
            <Popup>📍 Your Location</Popup>
          </CircleMarker>
        )}

        {stations.map((station) => {
          const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.grey;
          const report = station.latest_report;

          return (
            <CircleMarker
              key={station.id}
              center={[station.latitude, station.longitude]}
              radius={12}
              pathOptions={{ ...colors, fillOpacity: 0.85, weight: 2 }}
              eventHandlers={{ click: () => onMarkerClick?.(station) }}
            >
              <Popup className="station-popup">
                <MapPopupContent station={station} report={report} onUpvote={onUpvoteSuccess} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
