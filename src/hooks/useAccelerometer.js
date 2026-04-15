// Custom hook: Phone accelerometer access
import { useState, useEffect, useCallback, useRef } from 'react';

export function useAccelerometer() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0, magnitude: 0, timestamp: 0 });
  const [isActive, setIsActive] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // prompt, granted, denied
  const [error, setError] = useState(null);
  const historyRef = useRef([]);

  const handleMotion = useCallback((event) => {
    const acc = event.accelerationIncludingGravity || event.acceleration || {};
    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    const point = { x, y, z, magnitude, timestamp: Date.now() };
    setData(point);
    
    historyRef.current.push(point);
    if (historyRef.current.length > 500) {
      historyRef.current = historyRef.current.slice(-500);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionState('granted');
          window.addEventListener('devicemotion', handleMotion, true);
          setIsActive(true);
        } else {
          setPermissionState('denied');
          setError('Motion permission denied');
        }
      } else if ('DeviceMotionEvent' in window) {
        // Android / other
        setPermissionState('granted');
        window.addEventListener('devicemotion', handleMotion, true);
        setIsActive(true);
      } else {
        setError('Device motion not supported');
        setPermissionState('denied');
      }
    } catch (err) {
      setError(err.message);
      setPermissionState('denied');
    }
  }, [handleMotion]);

  const stop = useCallback(() => {
    window.removeEventListener('devicemotion', handleMotion, true);
    setIsActive(false);
  }, [handleMotion]);

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, [handleMotion]);

  return {
    data,
    isActive,
    permissionState,
    error,
    history: historyRef.current,
    requestPermission,
    stop
  };
}

export default useAccelerometer;
