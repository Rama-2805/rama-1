// Custom hook: Sensor stream receiver (BroadcastChannel + WebSocket)
import { useState, useEffect, useRef, useCallback } from 'react';

const CHANNEL_NAME = 'factoryshield-sensor';
const WS_URL = window.location.protocol === 'https:' ? `wss://${window.location.host}/ws-relay` : `ws://${window.location.host}/ws-relay`;

export function useSensorStream() {
  const [latestData, setLatestData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState(null); // 'broadcast' | 'websocket' | 'simulated'
  const [sampleRate, setSampleRate] = useState(0);
  const bufferRef = useRef([]);
  const magnitudeHistoryRef = useRef([]);
  const sampleCountRef = useRef(0);
  const lastSecondRef = useRef(Date.now());
  const channelRef = useRef(null);
  const wsRef = useRef(null);
  const simIntervalRef = useRef(null);

  const processIncoming = useCallback((data) => {
    setLatestData(data);
    bufferRef.current.push(data);
    if (bufferRef.current.length > 300) {
      bufferRef.current = bufferRef.current.slice(-300);
    }
    magnitudeHistoryRef.current.push(data.magnitude);
    if (magnitudeHistoryRef.current.length > 300) {
      magnitudeHistoryRef.current = magnitudeHistoryRef.current.slice(-300);
    }
    
    sampleCountRef.current++;
    const now = Date.now();
    if (now - lastSecondRef.current >= 1000) {
      setSampleRate(sampleCountRef.current);
      sampleCountRef.current = 0;
      lastSecondRef.current = now;
    }
  }, []);

  // Try BroadcastChannel
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;
      
      channel.onmessage = (event) => {
        if (!isConnected || connectionType !== 'broadcast') {
          setIsConnected(true);
          setConnectionType('broadcast');
        }
        processIncoming(event.data);
      };
    } catch (e) {
      console.log('BroadcastChannel not available');
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [processIncoming]);

  // Try WebSocket
  useEffect(() => {
    const connectWS = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        
        ws.onopen = () => {
          if (!isConnected) {
            setIsConnected(true);
            setConnectionType('websocket');
          }
          ws.send(JSON.stringify({ type: 'dashboard', action: 'subscribe' }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'sensor_data') {
              if (connectionType !== 'broadcast') {
                setIsConnected(true);
                setConnectionType('websocket');
              }
              processIncoming(data.payload);
            }
          } catch (e) {}
        };
        
        ws.onclose = () => {
          if (connectionType === 'websocket') {
            setIsConnected(false);
            setConnectionType(null);
          }
          // Retry after 5s
          setTimeout(connectWS, 5000);
        };
        
        ws.onerror = () => {
          ws.close();
        };
      } catch (e) {
        setTimeout(connectWS, 5000);
      }
    };
    
    connectWS();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Simulated sensor stream (fallback, always available)
  const startSimulation = useCallback(() => {
    if (simIntervalRef.current) return;
    
    let t = 0;
    setConnectionType('simulated');
    setIsConnected(true);
    
    simIntervalRef.current = setInterval(() => {
      t += 0.05;
      // Simulate varying vibration with periodic spikes
      const baseVib = 0.3 + 0.1 * Math.sin(t * 2);
      const spike = Math.random() > 0.95 ? Math.random() * 2 : 0;
      const noise = (Math.random() - 0.5) * 0.3;
      
      const x = baseVib * Math.sin(t * 5.1) + noise + spike * 0.5;
      const y = baseVib * Math.cos(t * 3.7) + noise * 0.8;
      const z = 9.81 + baseVib * Math.sin(t * 7.3) + noise * 0.4 + spike * 0.3;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      processIncoming({
        x: parseFloat(x.toFixed(3)),
        y: parseFloat(y.toFixed(3)),
        z: parseFloat(z.toFixed(3)),
        magnitude: parseFloat(magnitude.toFixed(3)),
        timestamp: Date.now()
      });
    }, 50);
  }, [processIncoming]);

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setIsConnected(false);
      setConnectionType(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  return {
    latestData,
    isConnected,
    connectionType,
    sampleRate,
    buffer: bufferRef.current,
    magnitudeHistory: magnitudeHistoryRef.current,
    startSimulation,
    stopSimulation
  };
}

export default useSensorStream;
