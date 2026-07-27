import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const STATUS_COLORS = {
  green:  { color: '#22c55e', fillColor: '#16a34a' },
  yellow: { color: '#eab308', fillColor: '#ca8a04' },
  red:    { color: '#ef4444', fillColor: '#dc2626' },
  grey:   { color: '#9ca3af', fillColor: '#6b7280' },
};

/** Sub-component: smoothly flies to user location when provided */
function FlyToUser({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 1.5 });
  }, [position, map]);
  return null;
}

/** Sub-component: flies to selected station when highlighted from sidebar */
function FlyToStation({ station }) {
  const map = useMap();
  useEffect(() => {
    if (station) map.flyTo([station.latitude, station.longitude], 15, { duration: 1 });
  }, [station, map]);
  return null;
}

export default function StationMap({ stations, userPosition, selectedStation, onMarkerClick }) {
  // Default center: Nigeria geographic center
  const defaultCenter = [9.082, 8.6753];
  const defaultZoom = 6;

  return (
    <div id="station-map-container" className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="leaflet-map"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fly to user GPS position */}
        {userPosition && <FlyToUser position={userPosition} />}

        {/* Fly to selected station from sidebar */}
        {selectedStation && <FlyToStation station={selectedStation} />}

        {/* User's current location marker */}
        {userPosition && (
          <CircleMarker
            center={userPosition}
            radius={10}
            pathOptions={{ color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.9, weight: 3 }}
          >
            <Popup>📍 Your Location</Popup>
          </CircleMarker>
        )}

        {/* Station markers */}
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
                <div className="popup-inner">
                  <strong className="popup-name">{station.name}</strong>
                  <span className="popup-brand">{station.brand}</span>
                  {report ? (
                    <>
                      <span className="popup-fuel">{report.fuel_type}</span>
                      <span className="popup-price">
                        {report.is_available ? `₦${report.price_per_litre.toLocaleString()}/L` : 'Out of Stock'}
                      </span>
                      <span className="popup-time">{report.minutes_ago}m ago</span>
                    </>
                  ) : (
                    <span className="popup-no-report">No report yet</span>
                  )}
                  <Link to={`/stations/${station.id}`} className="popup-link">
                    View Details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
