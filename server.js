// FactoryShield AI — WebSocket Relay Server
// Bridges phone sensor data to the main dashboard over WebSocket
// Run with: node server.js

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = 8765;
const clients = new Map(); // id -> { ws, role }

let clientIdCounter = 0;

const httpServer = createServer((req, res) => {
  // Handle CORS preflight for browser connections
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/status') {
    const sensors = [...clients.values()].filter(c => c.role === 'sensor').length;
    const dashboards = [...clients.values()].filter(c => c.role === 'dashboard').length;
    res.end(JSON.stringify({ status: 'ok', sensors, dashboards, totalClients: clients.size }));
  } else {
    res.end(JSON.stringify({ service: 'FactoryShield AI WebSocket Relay', port: PORT }));
  }
});

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  const id = ++clientIdCounter;
  const clientInfo = { ws, role: 'unknown', id };
  clients.set(id, clientInfo);
  
  console.log(`[${new Date().toISOString()}] Client ${id} connected from ${req.socket.remoteAddress}`);
  
  ws.send(JSON.stringify({ type: 'welcome', clientId: id, message: 'FactoryShield AI sensor relay ready.' }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      
      // Handle role registration
      if (msg.type === 'sensor' && msg.action === 'register') {
        clientInfo.role = 'sensor';
        console.log(`[${id}] Registered as SENSOR`);
        ws.send(JSON.stringify({ type: 'registered', role: 'sensor' }));
        return;
      }
      
      if (msg.type === 'dashboard' && msg.action === 'subscribe') {
        clientInfo.role = 'dashboard';
        console.log(`[${id}] Registered as DASHBOARD`);
        ws.send(JSON.stringify({ type: 'registered', role: 'dashboard' }));
        return;
      }
      
      // Forward sensor data to all dashboards
      if (msg.type === 'sensor_data') {
        if (clientInfo.role === 'unknown') clientInfo.role = 'sensor';
        
        let forwarded = 0;
        for (const [clientId, client] of clients) {
          if (clientId !== id && client.role === 'dashboard' && client.ws.readyState === 1) {
            try {
              client.ws.send(JSON.stringify(msg));
              forwarded++;
            } catch (err) {
              console.error(`Failed to forward to dashboard ${clientId}:`, err.message);
            }
          }
        }
        
        if (forwarded > 0) {
          process.stdout.write(`\r[Relay] Sensor ${id} → ${forwarded} dashboard(s) | mag: ${msg.payload?.magnitude?.toFixed(3) || '?'}  `);
        }
        return;
      }
      
      // Ping/pong
      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        return;
      }
    } catch (err) {
      console.error(`[${id}] Parse error:`, err.message);
    }
  });

  ws.on('close', () => {
    console.log(`\n[${new Date().toISOString()}] Client ${id} (${clientInfo.role}) disconnected`);
    clients.delete(id);
  });

  ws.on('error', (err) => {
    console.error(`[${id}] WebSocket error:`, err.message);
    clients.delete(id);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔═══════════════════════════════════════════════╗`);
  console.log(`║  FactoryShield AI — WebSocket Relay Server    ║`);
  console.log(`╠═══════════════════════════════════════════════╣`);
  console.log(`║  Listening on:  ws://0.0.0.0:${PORT}             ║`);
  console.log(`║  Status API:    http://localhost:${PORT}/status   ║`);
  console.log(`║                                               ║`);
  console.log(`║  Phone → connect to ws://<your-ip>:${PORT}       ║`);
  console.log(`║  Dash  → this forwards sensor data to dash   ║`);
  console.log(`╚═══════════════════════════════════════════════╝\n`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\nShutting down relay server...');
  wss.close();
  httpServer.close();
  process.exit(0);
});
