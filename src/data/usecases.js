// South India MSME Use Cases

export const USE_CASES = [
  {
    id: 'textile',
    title: 'Textile Machine Motors',
    location: 'Coimbatore, Tamil Nadu',
    icon: '🧵',
    description: 'Spinning and weaving motors in textile clusters run 20+ hours daily. Bearing failures cause yarn breakage, production loss, and costly rethreading downtime.',
    impact: {
      downtime: '65% reduction in unplanned stops',
      savings: '₹3.2 lakh/year per unit',
      efficiency: '12% production throughput increase'
    },
    machines: 'Ring frame motors, loom drives, winding machines',
    challenge: 'High-speed operation (8000+ RPM spindles) generates complex vibration signatures that mask early-stage faults.'
  },
  {
    id: 'food',
    title: 'Food Processing Pumps',
    location: 'Mysuru, Karnataka',
    icon: '🏭',
    description: 'Centrifugal and positive displacement pumps in dairy and beverage plants. Seal and impeller failures cause product contamination and regulatory violations.',
    impact: {
      downtime: '72% reduction in pump failures',
      savings: '₹5.1 lakh/year per line',
      efficiency: '18% maintenance cost reduction'
    },
    machines: 'CIP pumps, transfer pumps, homogenizers',
    challenge: 'Harsh washdown environments accelerate bearing degradation. Detecting faults before seal breach is critical for food safety.'
  },
  {
    id: 'packaging',
    title: 'Packaging Conveyor Systems',
    location: 'Hosur, Tamil Nadu',
    icon: '📦',
    description: 'High-speed conveyor drives in automotive and FMCG packaging lines. Gearbox and belt failures halt entire production lines.',
    impact: {
      downtime: '58% reduction in line stoppages',
      savings: '₹2.8 lakh/year per line',
      efficiency: '15% OEE improvement'
    },
    machines: 'Belt conveyors, roller conveyors, pick-and-place drives',
    challenge: 'Multiple interconnected drives make fault isolation difficult. System-level monitoring needed.'
  },
  {
    id: 'workshop',
    title: 'Workshop Compressors',
    location: 'Peenya, Bangalore',
    icon: '🔧',
    description: 'Reciprocating and screw compressors in small machine shops. Valve and piston failures cut compressed air supply to entire workshop.',
    impact: {
      downtime: '70% reduction in air supply interruptions',
      savings: '₹1.9 lakh/year per compressor',
      efficiency: '22% energy efficiency gain'
    },
    machines: 'Reciprocating compressors, screw compressors, air dryers',
    challenge: 'Small workshops lack maintenance staff. Automated monitoring and alerts are essential for unattended operation.'
  },
  {
    id: 'cnc',
    title: 'CNC Spindle Bearings',
    location: 'Tumkur, Karnataka',
    icon: '⚙️',
    description: 'High-precision CNC spindle bearings directly affect machining quality. Bearing defects cause dimensional errors, surface finish issues, and tool breakage.',
    impact: {
      downtime: '80% reduction in spindle failures',
      savings: '₹8.5 lakh/year per CNC center',
      efficiency: '25% scrap rate reduction'
    },
    machines: 'CNC lathes, milling centers, grinding machines',
    challenge: 'Extremely tight tolerances (micron-level) require detecting nano-scale vibration changes before they affect part quality.'
  }
];

export default USE_CASES;
