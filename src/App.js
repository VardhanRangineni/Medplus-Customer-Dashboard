
import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/dashboard.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardSections from './components/DashboardSections';
import FilterBar from './components/FilterBar';

import { aggregateStateData, aggregateAreas, getFilteredAreas } from './utils/dataAggregator';

// Import Data Sources
import defaultData from './Assets/data.json';
import stateAreaData from './Assets/Data - 2.0.json';

function App() {
  const [activeSection, setActiveSection] = useState('section1');

  // Filter States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter States
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);

  // Derived Data
  const states = useMemo(() => Object.keys(stateAreaData), []);

  const areas = useMemo(() => {
    if (!selectedState) return [];
    return Object.keys(stateAreaData[selectedState] || {});
  }, [selectedState]);

  const supervisors = useMemo(() => {
    if (!selectedState) return [];
    const areasForState = Object.values(stateAreaData[selectedState] || {});
    // return as list of { id, label }
    const map = new Map();
    areasForState.forEach(a => {
      if (a.supervisorId || a.supervisor) {
        const id = a.supervisorId || a.supervisor;
        const label = a.supervisor || a.supervisorId;
        if (!map.has(id)) map.set(id, { id, label });
      }
    });
    const list = Array.from(map.values());
    console.log('Supervisors list for state', selectedState, ':', list);
    return list;
  }, [selectedState]);

  const managers = useMemo(() => {
    if (!selectedState) return [];
    const areasForState = Object.values(stateAreaData[selectedState] || {});
    // if selectedSupervisor is an id (SUP_*), filter by supervisorId, otherwise by name
    let filteredBySup = areasForState;
    if (selectedSupervisor) {
      const isId = (s) => typeof s === 'string' && s.startsWith('SUP_');
      if (isId(selectedSupervisor)) {
        filteredBySup = areasForState.filter(a => (a.supervisorId || '') === selectedSupervisor);
      } else {
        const supNorm = (s) => typeof s === 'string' ? s.trim().toLowerCase() : '';
        filteredBySup = areasForState.filter(a => supNorm(a.supervisor) === supNorm(selectedSupervisor));
      }
    }
    const map = new Map();
    filteredBySup.forEach(a => {
      if (a.managerId || a.manager) {
        const id = a.managerId || a.manager;
        const label = a.manager || a.managerId;
        if (!map.has(id)) map.set(id, { id, label });
      }
    });
    const list = Array.from(map.values());
    console.log('Managers list for state', selectedState, 'sup', selectedSupervisor, ':', list);
    return list;
  }, [selectedState, selectedSupervisor]);

  // Determine which data to show
  const currentData = useMemo(() => {
    console.log('Recalculating currentData', { selectedState, selectedArea, selectedSupervisor, selectedManager });

    if (!selectedState) {
      return defaultData;
    }

    const filteredAreas = getFilteredAreas(stateAreaData, selectedState, selectedArea, selectedSupervisor, selectedManager);
    console.log('Filtered areas length:', filteredAreas.length, 'selectedArea:', selectedArea, 'selectedSupervisor:', selectedSupervisor, 'selectedManager:', selectedManager);

    // If a specific area is selected and no supervisor/manager is active, return that area's data directly
    if (selectedArea && !selectedSupervisor && !selectedManager && filteredAreas.length === 1) {
      return filteredAreas[0];
    }

    if (filteredAreas.length > 0) {
      const title = `MedPlus - ${selectedState} (Filtered View)`;
      return aggregateAreas(filteredAreas, title) || defaultData;
    }

    // If there are no results for the selected combination (e.g., selectedArea doesn't match supervisor/manager),
    // try a fallback: expand the area filter and aggregate only by state + supervisor/manager (no area restriction).
    if ((selectedSupervisor || selectedManager) && selectedArea) {
      const fallbackAreas = getFilteredAreas(stateAreaData, selectedState, '', selectedSupervisor, selectedManager);
      if (fallbackAreas.length > 0) {
        const title = `MedPlus - ${selectedState} (Filtered View - fallback by Supervisor/Manager)`;
        console.log('Fallback to supervisor/manager-only aggregation', { selectedSupervisor, selectedManager, fallbackAreasLength: fallbackAreas.length });
        return aggregateAreas(fallbackAreas, title) || defaultData;
      }
    }

    // If nothing matched, fallback to aggregating entire state if only state is selected
    if (selectedState && !selectedArea && !selectedSupervisor && !selectedManager) {
      const aggregated = aggregateStateData(selectedState, stateAreaData);
      return aggregated || defaultData;
    }

    // All else fallback
    return defaultData;
  }, [selectedState, selectedArea, selectedSupervisor, selectedManager]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedArea(''); // Reset area when state changes
    setSelectedSupervisor('');
    setSelectedManager('');
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
    setSelectedSupervisor('');
    setSelectedManager('');
  };

  const handleSupervisorChange = (sup) => {
    setSelectedSupervisor(sup);
    setSelectedManager('');
  };

  const handleManagerChange = (mgr) => {
    setSelectedManager(mgr);
    if (mgr) {
      // find manager's supervisor (if exists) and set it for UX convenience
      const areasForMgr = getFilteredAreas(stateAreaData, selectedState, selectedArea, '', mgr);
      if (areasForMgr && areasForMgr.length > 0) {
        // prefer id if exists
        const supId = areasForMgr[0].supervisorId || areasForMgr[0].supervisor;
        if (supId) setSelectedSupervisor(supId);
      }
      // Do not clear area by default; keep intersection semantics (area+manager filters to area if applicable)
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close sidebar on mobile when a section is clicked
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-content-wrapper">
        <Sidebar
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="content-area">
          <FilterBar
            states={states}
            areas={areas}
            selectedState={selectedState}
            selectedArea={selectedArea}
            onStateChange={handleStateChange}
            onAreaChange={handleAreaChange}
            supervisors={supervisors}
            managers={managers}
            selectedSupervisor={selectedSupervisor}
            selectedManager={selectedManager}
            onSupervisorChange={handleSupervisorChange}
            onManagerChange={handleManagerChange}
            isOpen={isFiltersOpen}
            toggleFilters={toggleFilters}
          />
          <DashboardSections data={currentData} selectedState={selectedState} />
        </div>
      </div>
    </div>
  );
}

export default App;
