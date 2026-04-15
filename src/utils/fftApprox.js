// Simplified FFT approximation for live vibration data
// Uses a basic DFT-like approach for frequency band estimation

/**
 * Compute approximate frequency bands from time-domain signal
 * Returns power in 8 frequency bands
 */
export function computeFrequencyBands(values, sampleRate = 60) {
  if (!values || values.length < 16) {
    return Array(8).fill(0).map((_, i) => ({
      band: i,
      label: `${Math.round(i * sampleRate / 16)}-${Math.round((i + 1) * sampleRate / 16)} Hz`,
      power: 0
    }));
  }

  const N = values.length;
  const bands = [];
  const numBands = 8;
  const binSize = Math.floor(N / (numBands * 2));

  // Remove DC component
  const mean = values.reduce((s, v) => s + v, 0) / N;
  const centered = values.map(v => v - mean);

  // Apply Hanning window
  const windowed = centered.map((v, i) => 
    v * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)))
  );

  // Simplified DFT for each band
  for (let b = 0; b < numBands; b++) {
    let power = 0;
    const freqStart = b * binSize + 1;
    const freqEnd = (b + 1) * binSize;

    for (let k = freqStart; k <= freqEnd && k < N / 2; k++) {
      let real = 0, imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += windowed[n] * Math.cos(angle);
        imag -= windowed[n] * Math.sin(angle);
      }
      power += (real * real + imag * imag) / (N * N);
    }

    const freq = (b * sampleRate) / (numBands * 2);
    const freqH = ((b + 1) * sampleRate) / (numBands * 2);
    
    bands.push({
      band: b,
      label: `${Math.round(freq)}-${Math.round(freqH)} Hz`,
      power: Math.sqrt(power) * 10,
      frequency: (freq + freqH) / 2
    });
  }

  // Normalize
  const maxPower = Math.max(...bands.map(b => b.power), 0.001);
  bands.forEach(b => {
    b.normalizedPower = b.power / maxPower;
  });

  return bands;
}

/**
 * Quick spectral estimation using autocorrelation
 * Faster than DFT for real-time display
 */
export function quickSpectralEstimate(values) {
  if (!values || values.length < 8) {
    return { dominant: 0, energy: 0, bands: [0, 0, 0, 0] };
  }

  const N = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / N;
  const centered = values.map(v => v - mean);

  // Autocorrelation for dominant frequency
  let maxCorr = 0;
  let dominantLag = 1;
  for (let lag = 1; lag < N / 2; lag++) {
    let corr = 0;
    for (let i = 0; i < N - lag; i++) {
      corr += centered[i] * centered[i + lag];
    }
    corr /= (N - lag);
    if (corr > maxCorr) {
      maxCorr = corr;
      dominantLag = lag;
    }
  }

  // Energy in 4 bands (simple moving variance approach)
  const quarterN = Math.floor(N / 4);
  const bands = [];
  for (let q = 0; q < 4; q++) {
    const segment = centered.slice(q * quarterN, (q + 1) * quarterN);
    const diff = segment.slice(1).map((v, i) => v - segment[i]);
    const energy = diff.reduce((s, v) => s + v * v, 0) / diff.length;
    bands.push(energy);
  }

  return {
    dominant: dominantLag > 0 ? 60 / dominantLag : 0,
    energy: centered.reduce((s, v) => s + v * v, 0) / N,
    bands
  };
}

export default { computeFrequencyBands, quickSpectralEstimate };
