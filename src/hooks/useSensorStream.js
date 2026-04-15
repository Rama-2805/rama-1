// Custom hook: Sensor stream receiver (BroadcastChannel + WebSocket)
import { useState, useEffect, useRef, useCallback } from 'react';

const CHANNEL_NAME = 'aegis-sensor';
const WS_URL = window.location.protocol === 'https:' ? `wss://${window.location.host}/ws-relay` : `ws://${window.location.host}/ws-relay`;

// NASA Test 2 Reference continuous subset
const NASA_TEST2_SAMPLE = [
  { max: 0.454, rms: 0.0741 }, { max: 0.388, rms: 0.0753 }, { max: 0.503, rms: 0.0762 },
  { max: 0.608, rms: 0.0787 }, { max: 0.584, rms: 0.0815 }, { max: 0.495, rms: 0.0822 },
  { max: 0.564, rms: 0.0841 }, { max: 0.473, rms: 0.0850 }, { max: 0.521, rms: 0.0854 },
  { max: 0.580, rms: 0.0861 }, { max: 0.498, rms: 0.0872 }, { max: 0.540, rms: 0.0881 },
  { max: 0.655, rms: 0.0890 }, { max: 0.702, rms: 0.0895 }, { max: 0.620, rms: 0.0911 },
  { max: 0.590, rms: 0.0921 }, { max: 0.640, rms: 0.0934 }, { max: 0.710, rms: 0.0945 },
  { max: 0.680, rms: 0.0952 }, { max: 0.740, rms: 0.0961 }, { max: 0.810, rms: 0.0975 },
  { max: 0.780, rms: 0.0982 }, { max: 0.850, rms: 0.1001 }, { max: 0.890, rms: 0.1015 },
  { max: 0.950, rms: 0.1030 }, { max: 1.020, rms: 0.1054 }, { max: 1.150, rms: 0.1082 },
  { max: 1.250, rms: 0.1111 }, { max: 1.350, rms: 0.1154 }, { max: 1.500, rms: 0.1210 }
];

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
  const simulationIndexRef = useRef(0);

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
    
    setConnectionType('simulated');
    setIsConnected(true);
    
    simIntervalRef.current = setInterval(() => {
      const currentNASA = NASA_TEST2_SAMPLE[simulationIndexRef.current % NASA_TEST2_SAMPLE.length];
      simulationIndexRef.current++;
      
      const x = currentNASA.max * 0.5;
      const y = currentNASA.rms * 5.0; // scale up visual wave
      const z = currentNASA.max * 0.8;
      
      // We directly inject the NASA dataset magnitude metrics into the stream pipeline
      const magnitude = currentNASA.max;
      
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
