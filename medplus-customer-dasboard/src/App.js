
import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/dashboard.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardSections from './components/DashboardSections';
import FilterBar from './components/FilterBar';

import { aggregateStateData } from './utils/dataAggregator';

// Import Data Sources
import defaultData from './Assets/data.json';
import stateAreaData from './Assets/dashboard_by_state_area_download.json';

function App() {
  const [activeSection, setActiveSection] = useState('section1');

  // Filter States
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Derived Data
  const states = useMemo(() => Object.keys(stateAreaData), []);

  const areas = useMemo(() => {
    if (!selectedState) return [];
    return Object.keys(stateAreaData[selectedState] || {});
  }, [selectedState]);

  // Determine which data to show
  const currentData = useMemo(() => {
    console.log('Recalculating currentData', { selectedState, selectedArea });
    if (selectedState && selectedArea) {
      console.log('Returning specific area data');
      return stateAreaData[selectedState]?.[selectedArea] || defaultData;
    }
    if (selectedState) {
      console.log('Aggregating state data for:', selectedState);
      // Aggregate data for the selected state
      const aggregated = aggregateStateData(selectedState, stateAreaData);
      console.log('Aggregated data result:', aggregated ? 'Found' : 'Null');
      return aggregated || defaultData;
    }
    console.log('Returning default data');
    // Fallback to default data if no specific filter is selected
    // In a real app, you might want aggregated data here
    return defaultData;
  }, [selectedState, selectedArea]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedArea(''); // Reset area when state changes
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="main-content-wrapper">
        <Sidebar activeSection={activeSection} scrollToSection={scrollToSection} />
        <div className="content-area">
          <FilterBar
            states={states}
            areas={areas}
            selectedState={selectedState}
            selectedArea={selectedArea}
            onStateChange={handleStateChange}
            onAreaChange={handleAreaChange}
          />
          <DashboardSections data={currentData} />
        </div>
      </div>
    </div>
  );
}

export default App;
