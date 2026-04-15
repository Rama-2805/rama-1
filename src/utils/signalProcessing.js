// Signal processing utilities for vibration analysis

/**
 * Calculate Root Mean Square (RMS) of a signal
 */
export function calculateRMS(values) {
  if (!values || values.length === 0) return 0;
  const sumSquares = values.reduce((sum, v) => sum + v * v, 0);
  return Math.sqrt(sumSquares / values.length);
}

/**
 * Calculate Peak-to-Peak value
 */
export function calculatePeakToPeak(values) {
  if (!values || values.length === 0) return 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  return max - min;
}

/**
 * Calculate Kurtosis (peakedness of distribution)
 * Normal distribution kurtosis = 3. Higher = more impulsive.
 */
export function calculateKurtosis(values) {
  if (!values || values.length < 4) return 3;
  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
  if (variance === 0) return 3;
  const m4 = values.reduce((s, v) => s + Math.pow(v - mean, 4), 0) / n;
  return m4 / Math.pow(variance, 2);
}

/**
 * Calculate Skewness
 */
export function calculateSkewness(values) {
  if (!values || values.length < 3) return 0;
  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
  if (variance === 0) return 0;
  const m3 = values.reduce((s, v) => s + Math.pow(v - mean, 3), 0) / n;
  return m3 / Math.pow(variance, 1.5);
}

/**
 * Calculate Crest Factor (peak / RMS)
 */
export function calculateCrestFactor(values) {
  if (!values || values.length === 0) return 0;
  const rms = calculateRMS(values);
  if (rms === 0) return 0;
  const peak = Math.max(...values.map(Math.abs));
  return peak / rms;
}

/**
 * Calculate spectral energy (simplified)
 */
export function calculateSpectralEnergy(values) {
  if (!values || values.length === 0) return 0;
  const rms = calculateRMS(values);
  return rms * rms;
}

/**
 * Simplified band-power estimation
 * Splits signal into frequency bands using zero-crossing rate approximation
 */
export function estimateBandPower(values, sampleRate = 60) {
  if (!values || values.length < 8) {
    return { low: 0, mid: 0, high: 0, vhigh: 0 };
  }
  
  // Simple band estimation using differences
  const diffs1 = values.slice(1).map((v, i) => v - values[i]);
  const diffs2 = diffs1.slice(1).map((v, i) => v - diffs1[i]);
  
  const low = calculateRMS(values) * 0.6;
  const mid = calculateRMS(diffs1) * 0.4;
  const high = calculateRMS(diffs2) * 0.3;
  const vhigh = Math.abs(calculateKurtosis(values) - 3) * 0.1;
  
  const total = low + mid + high + vhigh || 1;
  
  return {
    low: low / total,
    mid: mid / total,
    high: high / total,
    vhigh: vhigh / total
  };
}

/**
 * Moving average filter
 */
export function movingAverage(values, windowSize = 5) {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(values.length, i + Math.ceil(windowSize / 2));
    const window = values.slice(start, end);
    result.push(window.reduce((s, v) => s + v, 0) / window.length);
  }
  return result;
}

/**
 * Calculate all features from a signal window
 */
export function extractFeatures(values) {
  return {
    rms: calculateRMS(values),
    peakToPeak: calculatePeakToPeak(values),
    kurtosis: calculateKurtosis(values),
    skewness: calculateSkewness(values),
    crestFactor: calculateCrestFactor(values),
    spectralEnergy: calculateSpectralEnergy(values),
    bandPower: estimateBandPower(values)
  };
}
