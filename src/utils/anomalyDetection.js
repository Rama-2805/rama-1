// Anomaly detection and health scoring

import { calculateRMS, calculateKurtosis, calculateCrestFactor } from './signalProcessing';

// Thresholds based on ISO 10816 vibration severity for machine class III
const THRESHOLDS = {
  rms: { good: 0.5, warning: 1.5, critical: 3.0 },
  kurtosis: { good: 4.0, warning: 6.0, critical: 8.0 },
  crestFactor: { good: 3.5, warning: 5.0, critical: 7.0 },
  temperature: { good: 60, warning: 80, critical: 95 }
};

/**
 * Calculate anomaly score from vibration values (0-1 scale)
 */
export function calculateAnomalyScore(values) {
  if (!values || values.length < 4) return 0;
  
  const rms = calculateRMS(values);
  const kurtosis = calculateKurtosis(values);
  const crestFactor = calculateCrestFactor(values);
  
  // Normalize each feature to 0-1 based on thresholds
  const rmsScore = Math.min(1, Math.max(0, (rms - THRESHOLDS.rms.good) / (THRESHOLDS.rms.critical - THRESHOLDS.rms.good)));
  const kurtosisScore = Math.min(1, Math.max(0, (kurtosis - THRESHOLDS.kurtosis.good) / (THRESHOLDS.kurtosis.critical - THRESHOLDS.kurtosis.good)));
  const crestScore = Math.min(1, Math.max(0, (crestFactor - THRESHOLDS.crestFactor.good) / (THRESHOLDS.crestFactor.critical - THRESHOLDS.crestFactor.good)));
  
  // Weighted combination
  return Math.min(1, rmsScore * 0.4 + kurtosisScore * 0.35 + crestScore * 0.25);
}

/**
 * Classify vibration status
 */
export function classifyStatus(anomalyScore) {
  if (anomalyScore < 0.25) return { status: 'normal', label: 'Normal', color: '#10b981' };
  if (anomalyScore < 0.55) return { status: 'warning', label: 'Warning', color: '#f59e0b' };
  return { status: 'critical', label: 'Critical', color: '#ef4444' };
}

/**
 * Calculate health score from anomaly score (inverse)
 */
export function calculateHealthScore(anomalyScore) {
  return Math.round(Math.max(0, Math.min(100, (1 - anomalyScore) * 100)));
}

/**
 * Estimate remaining useful life (in hours)
 */
export function estimateRUL(anomalyScore, trendSlope = 0) {
  if (anomalyScore < 0.1) return { hours: 720, label: '30+ days', confidence: 0.85 };
  if (anomalyScore < 0.3) return { hours: 336, label: '~14 days', confidence: 0.78 };
  if (anomalyScore < 0.5) return { hours: 168, label: '~7 days', confidence: 0.72 };
  if (anomalyScore < 0.7) return { hours: 72, label: '~72 hours', confidence: 0.65 };
  if (anomalyScore < 0.85) return { hours: 24, label: '~24 hours', confidence: 0.58 };
  return { hours: 4, label: '<4 hours', confidence: 0.52 };
}

/**
 * Simple threshold-based anomaly detector for live sensor data
 */
export function detectLiveAnomaly(magnitude, history = []) {
  // Calculate baseline from history
  if (history.length < 10) {
    return { isAnomaly: false, score: 0, threshold: 1.5 };
  }
  
  const mean = history.reduce((s, v) => s + v, 0) / history.length;
  const std = Math.sqrt(history.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / history.length);
  const threshold = mean + 2.5 * std;
  const score = std > 0 ? Math.min(1, Math.max(0, (magnitude - mean) / (3 * std))) : 0;
  
  return {
    isAnomaly: magnitude > threshold,
    score,
    threshold,
    mean,
    std
  };
}

export default { calculateAnomalyScore, classifyStatus, calculateHealthScore, estimateRUL, detectLiveAnomaly };
