// AI Maintenance Recommendations Engine

export const RECOMMENDATION_TEMPLATES = [
  {
    id: 'bearing-inspect',
    priority: 'critical',
    confidence: 0.94,
    title: 'Inspect Bearing Within 24 Hours',
    description: 'Drive-end bearing exhibiting inner race fault signature. Vibration amplitude exceeds ISO 10816 threshold for machine class III.',
    action: 'Schedule immediate bearing inspection. Prepare replacement SKF 6205-2RS bearing.',
    impact: 'Prevents unplanned shutdown. Estimated saved downtime: 8-12 hours.',
    timeframe: '24 hours',
    icon: 'alert-triangle'
  },
  {
    id: 'reduce-load',
    priority: 'high',
    confidence: 0.87,
    title: 'Reduce Operating Load to 70%',
    description: 'Current draw trending 15% above baseline. Motor winding temperature approaching thermal limit.',
    action: 'Reduce machine load to 70% capacity. Check downstream blockages or process settings.',
    impact: 'Extends motor life by estimated 2000+ operating hours.',
    timeframe: '4 hours',
    icon: 'trending-down'
  },
  {
    id: 'lubricate',
    priority: 'medium',
    confidence: 0.82,
    title: 'Lubricate Rotating Assembly',
    description: 'Vibration spectral analysis shows early signs of inadequate lubrication. Friction-related frequency bands elevated.',
    action: 'Apply Shell Gadus S2 V220 grease to bearing housings per manufacturer specification.',
    impact: 'Reduces bearing operating temperature by 8-12°C. Prevents premature wear.',
    timeframe: '48 hours',
    icon: 'droplets'
  },
  {
    id: 'replace-bearing',
    priority: 'high',
    confidence: 0.91,
    title: 'Replace Bearing at Next Maintenance Window',
    description: 'Outer race fault pattern confirmed. Defect size estimated at 0.014" based on spectral energy match with CWRU dataset.',
    action: 'Order replacement bearing. Schedule technician for next planned shutdown.',
    impact: 'Prevents catastrophic failure. Estimated cost saving: ₹45,000-₹80,000.',
    timeframe: '7 days',
    icon: 'wrench'
  },
  {
    id: 'schedule-technician',
    priority: 'medium',
    confidence: 0.79,
    title: 'Schedule Technician Visit',
    description: 'Multiple minor anomalies detected across compressor subsystem. Cumulative risk score trending upward.',
    action: 'Schedule qualified vibration analyst to perform detailed assessment with portable analyzer.',
    impact: 'Early intervention prevents cascading component failures.',
    timeframe: '5 days',
    icon: 'user-check'
  },
  {
    id: 'monitor-temp',
    priority: 'medium',
    confidence: 0.85,
    title: 'Monitor Temperature Every 15 Minutes',
    description: 'Temperature drift of +7°C detected over past 6 hours. Pattern consistent with developing thermal fault.',
    action: 'Increase temperature monitoring frequency. Set alert threshold at 85°C.',
    impact: 'Early warning allows controlled shutdown before thermal damage.',
    timeframe: 'Immediate',
    icon: 'thermometer'
  },
  {
    id: 'alignment-check',
    priority: 'low',
    confidence: 0.76,
    title: 'Check Shaft Alignment',
    description: 'Vibration signature shows 2x shaft frequency component elevation. Typical of angular or parallel misalignment.',
    action: 'Perform laser alignment check on coupling. Correct to within 0.05mm tolerance.',
    impact: 'Reduces bearing load by 15-20%. Extends component life.',
    timeframe: '2 weeks',
    icon: 'move'
  },
  {
    id: 'vibration-baseline',
    priority: 'info',
    confidence: 0.92,
    title: 'Update Vibration Baseline',
    description: 'Machine operating parameters have changed. Current baseline analysis may not reflect optimal reference values.',
    action: 'Collect 30-minute vibration dataset at current operating conditions. Update baseline in system.',
    impact: 'Improves anomaly detection accuracy by 8-12%.',
    timeframe: '1 week',
    icon: 'activity'
  }
];

export function getRecommendationsForMachine(machine) {
  if (machine.status === 'critical') {
    return RECOMMENDATION_TEMPLATES.filter(r => 
      ['bearing-inspect', 'reduce-load', 'replace-bearing', 'schedule-technician', 'monitor-temp'].includes(r.id)
    );
  } else if (machine.status === 'warning') {
    return RECOMMENDATION_TEMPLATES.filter(r => 
      ['lubricate', 'replace-bearing', 'alignment-check', 'monitor-temp'].includes(r.id)
    );
  } else {
    return RECOMMENDATION_TEMPLATES.filter(r => 
      ['vibration-baseline', 'lubricate'].includes(r.id)
    );
  }
}

export default { RECOMMENDATION_TEMPLATES, getRecommendationsForMachine };
