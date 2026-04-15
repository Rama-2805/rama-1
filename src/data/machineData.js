// Factory machine definitions and real-time state simulation

export const MACHINES = [
  {
    id: 'motor-a',
    name: 'Motor A',
    type: 'Induction Motor',
    location: 'Bay 1 - Primary Drive',
    power: '15 kW',
    rpm: 1450,
    installDate: '2022-03-15',
    lastMaintenance: '2025-12-10',
    nextMaintenance: '2026-05-15',
    healthScore: 91,
    status: 'healthy',
    vibration: 0.72,
    temperature: 52,
    current: 28.4,
    load: 78,
    components: [
      { id: 'bearing-de', name: 'Drive-End Bearing', health: 88, vibration: 0.85, temp: 58, anomaly: 0.12, risk: 'low', issue: 'Minor wear detected', action: 'Monitor next 72hrs' },
      { id: 'bearing-nde', name: 'Non-Drive-End Bearing', health: 95, vibration: 0.42, temp: 48, anomaly: 0.04, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'stator', name: 'Stator Winding', health: 93, vibration: 0.31, temp: 62, anomaly: 0.07, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'rotor', name: 'Rotor Assembly', health: 90, vibration: 0.68, temp: 55, anomaly: 0.10, risk: 'low', issue: 'Slight imbalance', action: 'Schedule balancing at next window' },
      { id: 'shaft', name: 'Drive Shaft', health: 96, vibration: 0.28, temp: 44, anomaly: 0.02, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'coupling', name: 'Shaft Coupling', health: 87, vibration: 0.92, temp: 46, anomaly: 0.15, risk: 'low', issue: 'Alignment drift', action: 'Check alignment within 1 week' }
    ]
  },
  {
    id: 'pump-b',
    name: 'Pump B',
    type: 'Centrifugal Pump',
    location: 'Bay 2 - Coolant System',
    power: '7.5 kW',
    rpm: 2900,
    installDate: '2021-08-22',
    lastMaintenance: '2025-11-05',
    nextMaintenance: '2026-04-20',
    healthScore: 74,
    status: 'warning',
    vibration: 1.85,
    temperature: 68,
    current: 14.2,
    load: 85,
    components: [
      { id: 'bearing-de', name: 'Drive-End Bearing', health: 62, vibration: 2.15, temp: 72, anomaly: 0.45, risk: 'high', issue: 'Outer race defect developing', action: 'Inspect bearing within 24 hours' },
      { id: 'bearing-nde', name: 'Non-Drive-End Bearing', health: 81, vibration: 1.20, temp: 58, anomaly: 0.18, risk: 'medium', issue: 'Elevated vibration', action: 'Monitor closely' },
      { id: 'impeller', name: 'Impeller', health: 78, vibration: 1.65, temp: 64, anomaly: 0.22, risk: 'medium', issue: 'Cavitation signs', action: 'Check NPSH and flow rate' },
      { id: 'seal', name: 'Mechanical Seal', health: 70, vibration: 0.95, temp: 71, anomaly: 0.32, risk: 'medium', issue: 'Seal wear detected', action: 'Plan replacement at next shutdown' },
      { id: 'shaft', name: 'Pump Shaft', health: 85, vibration: 1.10, temp: 56, anomaly: 0.12, risk: 'low', issue: 'Minor misalignment', action: 'Schedule laser alignment' },
      { id: 'coupling', name: 'Coupling', health: 88, vibration: 0.78, temp: 48, anomaly: 0.08, risk: 'low', issue: 'None', action: 'Normal operation' }
    ]
  },
  {
    id: 'compressor-c',
    name: 'Compressor C',
    type: 'Reciprocating Compressor',
    location: 'Bay 3 - Air Supply',
    power: '22 kW',
    rpm: 1000,
    installDate: '2020-01-10',
    lastMaintenance: '2026-01-20',
    nextMaintenance: '2026-07-20',
    healthScore: 43,
    status: 'critical',
    vibration: 3.42,
    temperature: 89,
    current: 42.8,
    load: 92,
    components: [
      { id: 'bearing-main', name: 'Main Bearing', health: 35, vibration: 4.10, temp: 95, anomaly: 0.82, risk: 'critical', issue: 'Inner race fault detected', action: 'STOP machine — replace bearing immediately' },
      { id: 'piston', name: 'Piston Assembly', health: 52, vibration: 3.20, temp: 88, anomaly: 0.58, risk: 'high', issue: 'Excessive wear on rings', action: 'Replace piston rings at bearing change' },
      { id: 'valve-intake', name: 'Intake Valve', health: 65, vibration: 2.10, temp: 76, anomaly: 0.35, risk: 'medium', issue: 'Valve flutter detected', action: 'Inspect valve springs' },
      { id: 'valve-discharge', name: 'Discharge Valve', health: 58, vibration: 2.80, temp: 92, anomaly: 0.48, risk: 'high', issue: 'Leakage detected', action: 'Replace valve plate' },
      { id: 'crankshaft', name: 'Crankshaft', health: 45, vibration: 3.50, temp: 82, anomaly: 0.71, risk: 'critical', issue: 'Bearing journal wear', action: 'Full crankshaft inspection required' },
      { id: 'motor', name: 'Drive Motor', health: 72, vibration: 1.80, temp: 74, anomaly: 0.25, risk: 'medium', issue: 'Overloaded operation', action: 'Reduce load or check downstream demand' }
    ]
  },
  {
    id: 'conveyor-d',
    name: 'Conveyor D',
    type: 'Belt Conveyor Drive',
    location: 'Bay 4 - Material Handling',
    power: '5.5 kW',
    rpm: 1440,
    installDate: '2023-05-18',
    lastMaintenance: '2026-02-28',
    nextMaintenance: '2026-08-28',
    healthScore: 97,
    status: 'healthy',
    vibration: 0.35,
    temperature: 42,
    current: 10.8,
    load: 55,
    components: [
      { id: 'bearing-drive', name: 'Drive Bearing', health: 97, vibration: 0.32, temp: 44, anomaly: 0.02, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'bearing-idler', name: 'Idler Bearing', health: 96, vibration: 0.28, temp: 40, anomaly: 0.03, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'belt', name: 'Conveyor Belt', health: 94, vibration: 0.18, temp: 38, anomaly: 0.05, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'gearbox', name: 'Reduction Gearbox', health: 98, vibration: 0.40, temp: 46, anomaly: 0.01, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'motor', name: 'Drive Motor', health: 97, vibration: 0.38, temp: 45, anomaly: 0.02, risk: 'none', issue: 'None', action: 'Normal operation' },
      { id: 'tensioner', name: 'Belt Tensioner', health: 93, vibration: 0.22, temp: 36, anomaly: 0.06, risk: 'none', issue: 'Slight tension drop', action: 'Adjust at next inspection' }
    ]
  }
];

// Generate time-series data for analytics charts
export function generateTimeSeriesData(machine, hours = 48) {
  const data = [];
  const baseVib = machine.vibration;
  const baseTemp = machine.temperature;
  const basePower = machine.current * 415 * 1.732 * 0.85 / 1000; // kW approx
  
  for (let h = 0; h < hours; h++) {
    const t = h / hours;
    const noise = () => (Math.random() - 0.5) * 0.15;
    const trend = machine.status === 'critical' ? t * 0.3 : machine.status === 'warning' ? t * 0.1 : 0;
    
    data.push({
      hour: h,
      time: `${Math.floor(h)}h`,
      vibration: Math.max(0, baseVib * (0.85 + trend + noise())),
      temperature: baseTemp * (0.95 + trend * 0.5 + noise() * 0.3),
      power: basePower * (0.9 + noise() * 0.2),
      healthScore: Math.max(0, Math.min(100, machine.healthScore - trend * 20 + noise() * 5)),
      anomalyScore: Math.min(1, Math.max(0, (machine.status === 'critical' ? 0.5 : machine.status === 'warning' ? 0.2 : 0.03) + trend + noise() * 0.1))
    });
  }
  return data;
}

// Anomaly events for timeline
export function generateAnomalyEvents(machine) {
  const events = [];
  const severity = machine.status;
  const count = severity === 'critical' ? 12 : severity === 'warning' ? 6 : 2;
  
  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 168); // last 7 days
    events.push({
      id: `${machine.id}-event-${i}`,
      timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      hoursAgo,
      type: ['vibration_spike', 'temperature_rise', 'current_anomaly', 'pattern_change'][Math.floor(Math.random() * 4)],
      severity: hoursAgo < 12 ? 'critical' : hoursAgo < 48 ? 'warning' : 'info',
      score: 0.3 + Math.random() * 0.7,
      component: machine.components[Math.floor(Math.random() * machine.components.length)].name
    });
  }
  return events.sort((a, b) => a.hoursAgo - b.hoursAgo);
}

export default { MACHINES, generateTimeSeriesData, generateAnomalyEvents };
