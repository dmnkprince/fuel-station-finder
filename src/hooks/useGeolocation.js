import { useState, useEffect, useCallback } from 'react';

export function useGeolocation() {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('user_position');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!position);
  const [flyToSignal, setFlyToSignal] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setError(null);
        setLoading(false);
        try {
          localStorage.setItem('user_position', JSON.stringify(newPos));
        } catch {
          /* ignore storage errors */
        }
      },
      (err) => {
        setLoading(false);
        let msg = 'Could not fetch your location. Please check your permissions.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Geolocation permission denied.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const recenter = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    // Force a fresh location fix if needed and signal map to fly to position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        try {
          localStorage.setItem('user_position', JSON.stringify(newPos));
        } catch {
          /* ignore */
        }
        setFlyToSignal((prev) => prev + 1);
      },
      () => {
        // Even if getCurrentPosition fails, attempt fly to existing position
        setFlyToSignal((prev) => prev + 1);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return {
    position,
    error,
    loading,
    recenter,
    flyToSignal,
  };
}
