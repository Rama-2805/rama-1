import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/hero/HeroSection';
import DigitalTwin from './components/twin/DigitalTwin';
import LiveSensorSection from './components/sensor/LiveSensorSection';
import DatasetSection from './components/dataset/DatasetSection';
import PipelineSection from './components/pipeline/PipelineSection';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import FactoryFloor from './components/factory/FactoryFloor';
import AIAdvisor from './components/advisor/AIAdvisor';
import ArchitectureSection from './components/architecture/ArchitectureSection';
import UseCaseSection from './components/usecases/UseCaseSection';
import CTASection from './components/cta/CTASection';
import SensorPage from './pages/SensorPage';
import { MACHINES } from './data/machineData';

function App() {
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(MACHINES[0]);
  const [isSensorPage, setIsSensorPage] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check if this is the sensor page
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/sensor' || hash === '#sensor-page') {
      setIsSensorPage(true);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (isSensorPage) {
    return <SensorPage />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Navbar 
        theme={theme} 
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
      />
      <main>
        <HeroSection />
        <DigitalTwin 
          machine={selectedMachine} 
          onComponentSelect={(comp) => console.log('Selected:', comp)} 
        />
        <LiveSensorSection />
        <DatasetSection />
        <PipelineSection />
        <AnalyticsDashboard 
          machine={selectedMachine} 
          onMachineChange={setSelectedMachine} 
        />
        <FactoryFloor 
          machines={MACHINES} 
          selectedMachine={selectedMachine}
          onSelectMachine={setSelectedMachine} 
        />
        <AIAdvisor machine={selectedMachine} />
        <ArchitectureSection />
        <UseCaseSection />
        <CTASection />
      </main>
    </div>
  );
}

export default App;
