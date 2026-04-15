// CWRU Bearing Dataset - Synthetic vibration data generator
// Based on Case Western Reserve University bearing fault dataset characteristics
// Sampling: 12kHz equivalent, fault frequencies modeled after 6205-2RS JEM SKF bearing

const SAMPLE_COUNT = 512;
const SAMPLING_RATE = 12000; // Hz

// Bearing fault characteristic frequencies (normalized to shaft speed ~1797 RPM)
const SHAFT_FREQ = 29.95; // Hz
const BPFI = 162.2; // Ball Pass Frequency Inner Race
const BPFO = 107.4; // Ball Pass Frequency Outer Race
const BSF = 141.1;  // Ball Spin Frequency
const FTF = 11.6;   // Fundamental Train Frequency

function generateNoise(amplitude, count) {
  const noise = [];
  for (let i = 0; i < count; i++) {
    noise.push((Math.random() - 0.5) * 2 * amplitude);
  }
  return noise;
}

function generateNormalBearing() {
  const data = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / SAMPLING_RATE;
    const shaft = 0.15 * Math.sin(2 * Math.PI * SHAFT_FREQ * t);
    const harmonic = 0.05 * Math.sin(2 * Math.PI * 2 * SHAFT_FREQ * t + 0.3);
    const noise = (Math.random() - 0.5) * 0.08;
    data.push({
      time: t * 1000,
      amplitude: shaft + harmonic + noise,
      index: i
    });
  }
  return data;
}

function generateInnerRaceFault() {
  const data = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / SAMPLING_RATE;
    const shaft = 0.12 * Math.sin(2 * Math.PI * SHAFT_FREQ * t);
    // Inner race fault: periodic impulses at BPFI, amplitude modulated by shaft speed
    const impulsePhase = (2 * Math.PI * BPFI * t) % (2 * Math.PI);
    const impulse = impulsePhase < 0.3 ? 0.8 * Math.exp(-impulsePhase * 10) * Math.sin(2 * Math.PI * 3200 * t) : 0;
    const modulation = 1 + 0.5 * Math.sin(2 * Math.PI * SHAFT_FREQ * t);
    const noise = (Math.random() - 0.5) * 0.15;
    data.push({
      time: t * 1000,
      amplitude: shaft + impulse * modulation + noise,
      index: i
    });
  }
  return data;
}

function generateOuterRaceFault() {
  const data = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / SAMPLING_RATE;
    const shaft = 0.1 * Math.sin(2 * Math.PI * SHAFT_FREQ * t);
    // Outer race fault: periodic impulses at BPFO, relatively constant amplitude
    const impulsePhase = (2 * Math.PI * BPFO * t) % (2 * Math.PI);
    const impulse = impulsePhase < 0.25 ? 0.65 * Math.exp(-impulsePhase * 12) * Math.sin(2 * Math.PI * 2800 * t) : 0;
    const noise = (Math.random() - 0.5) * 0.12;
    data.push({
      time: t * 1000,
      amplitude: shaft + impulse + noise,
      index: i
    });
  }
  return data;
}

function generateBallFault() {
  const data = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / SAMPLING_RATE;
    const shaft = 0.1 * Math.sin(2 * Math.PI * SHAFT_FREQ * t);
    // Ball fault: irregular impulses at BSF, amplitude varies
    const impulsePhase = (2 * Math.PI * BSF * t) % (2 * Math.PI);
    const impulse = impulsePhase < 0.2 ? 0.5 * Math.exp(-impulsePhase * 15) * Math.sin(2 * Math.PI * 3500 * t) : 0;
    const randomMod = 0.7 + Math.random() * 0.6;
    const noise = (Math.random() - 0.5) * 0.18;
    data.push({
      time: t * 1000,
      amplitude: shaft + impulse * randomMod + noise,
      index: i
    });
  }
  return data;
}

// Generate spectral data (simplified power spectrum)
function generateSpectrum(faultType) {
  const bands = [];
  const freqs = [0, 50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000];
  
  for (let i = 0; i < freqs.length - 1; i++) {
    const freq = (freqs[i] + freqs[i + 1]) / 2;
    let power = 0.05 + Math.random() * 0.03; // base noise floor
    
    // Add fault-specific spectral peaks
    if (faultType === 'normal') {
      if (Math.abs(freq - SHAFT_FREQ) < 30) power += 0.4;
      if (Math.abs(freq - 2 * SHAFT_FREQ) < 30) power += 0.15;
    } else if (faultType === 'inner') {
      if (Math.abs(freq - SHAFT_FREQ) < 30) power += 0.3;
      if (Math.abs(freq - BPFI) < 40) power += 0.7;
      if (Math.abs(freq - 2 * BPFI) < 40) power += 0.35;
      if (freq > 2500 && freq < 3500) power += 0.45;
    } else if (faultType === 'outer') {
      if (Math.abs(freq - SHAFT_FREQ) < 30) power += 0.25;
      if (Math.abs(freq - BPFO) < 40) power += 0.65;
      if (Math.abs(freq - 2 * BPFO) < 40) power += 0.3;
      if (freq > 2200 && freq < 3200) power += 0.4;
    } else if (faultType === 'ball') {
      if (Math.abs(freq - SHAFT_FREQ) < 30) power += 0.2;
      if (Math.abs(freq - BSF) < 40) power += 0.5;
      if (Math.abs(freq - 2 * BSF) < 40) power += 0.25;
      if (freq > 3000 && freq < 4000) power += 0.35;
    }
    
    bands.push({
      frequency: freq,
      power: power,
      label: `${freqs[i]}-${freqs[i + 1]} Hz`
    });
  }
  return bands;
}

export const FAULT_CLASSES = [
  {
    id: 'normal',
    name: 'Normal Bearing',
    description: 'Healthy bearing with expected vibration signature. Low amplitude, dominant shaft frequency only.',
    severity: 'healthy',
    color: '#10b981',
    confidence: 0.96,
    rms: 0.12,
    kurtosis: 3.1,
    crestFactor: 2.8,
    peakToPeak: 0.34,
    waveform: generateNormalBearing(),
    spectrum: generateSpectrum('normal'),
    features: { rms: 0.12, kurtosis: 3.1, crestFactor: 2.8, skewness: 0.05, spectralEnergy: 0.08 }
  },
  {
    id: 'inner',
    name: 'Inner Race Fault',
    description: 'Defect on inner race surface. Periodic impulses at BPFI modulated by shaft rotation.',
    severity: 'critical',
    color: '#ef4444',
    confidence: 0.91,
    rms: 0.68,
    kurtosis: 7.2,
    crestFactor: 5.1,
    peakToPeak: 1.42,
    waveform: generateInnerRaceFault(),
    spectrum: generateSpectrum('inner'),
    features: { rms: 0.68, kurtosis: 7.2, crestFactor: 5.1, skewness: 1.3, spectralEnergy: 0.62 }
  },
  {
    id: 'outer',
    name: 'Outer Race Fault',
    description: 'Defect on outer race surface. High-energy impulses at BPFO, relatively constant amplitude.',
    severity: 'warning',
    color: '#f59e0b',
    confidence: 0.88,
    rms: 0.52,
    kurtosis: 5.8,
    crestFactor: 4.3,
    peakToPeak: 1.15,
    waveform: generateOuterRaceFault(),
    spectrum: generateSpectrum('outer'),
    features: { rms: 0.52, kurtosis: 5.8, crestFactor: 4.3, skewness: 0.8, spectralEnergy: 0.45 }
  },
  {
    id: 'ball',
    name: 'Ball Fault',
    description: 'Rolling element defect. Irregular impulse pattern at BSF with variable amplitude modulation.',
    severity: 'warning',
    color: '#f97316',
    confidence: 0.84,
    rms: 0.41,
    kurtosis: 6.1,
    crestFactor: 4.7,
    peakToPeak: 0.98,
    waveform: generateBallFault(),
    spectrum: generateSpectrum('ball'),
    features: { rms: 0.41, kurtosis: 6.1, crestFactor: 4.7, skewness: 0.95, spectralEnergy: 0.38 }
  }
];

// Generate degradation trend data (NASA IMS style)
export function generateDegradationTrend() {
  const data = [];
  const totalHours = 720; // 30 days
  for (let h = 0; h < totalHours; h += 4) {
    const t = h / totalHours;
    // Exponential degradation curve
    const baseLine = 0.1 + 0.05 * Math.sin(h * 0.1);
    const degradation = t < 0.6 ? 0 : 0.8 * Math.pow((t - 0.6) / 0.4, 2.5);
    const noise = (Math.random() - 0.5) * 0.06;
    data.push({
      hour: h,
      day: Math.floor(h / 24),
      rms: baseLine + degradation + noise,
      kurtosis: 3.0 + (t > 0.6 ? 4.5 * Math.pow((t - 0.6) / 0.4, 2) : 0) + (Math.random() - 0.5) * 0.5,
      healthScore: Math.max(0, Math.min(100, 95 - degradation * 90 + (Math.random() - 0.5) * 3)),
      temperature: 45 + degradation * 25 + (Math.random() - 0.5) * 2
    });
  }
  return data;
}

export const ML_MODELS = [
  { name: 'Random Forest', accuracy: 97.2, f1: 0.965, type: 'Fault Classification' },
  { name: 'XGBoost', accuracy: 96.8, f1: 0.958, type: 'Fault Classification' },
  { name: '1D CNN', accuracy: 98.1, f1: 0.978, type: 'Pattern Recognition' },
  { name: 'LSTM', accuracy: 95.4, f1: 0.942, type: 'Sequence Modeling' },
  { name: 'Autoencoder', accuracy: 93.6, f1: 0.921, type: 'Anomaly Detection' }
];

export default { FAULT_CLASSES, generateDegradationTrend, ML_MODELS };
