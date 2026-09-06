import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MissionControlPage } from './pages/MissionControlPage';
import { EventsPage } from './pages/EventsPage';
import { MapPage } from './pages/MapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('EVT-1048'); // Pre-select hero event for demonstration
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [region, setRegion] = useState<string>('Western India Industrial Corridor');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Mission Control Dashboard';
      case 'events':
        return 'Thermal Events Catalog';
      case 'map':
        return 'Tactical Geospatial Map';
      case 'analytics':
        return 'Anomaly Analytics & Trends';
      case 'sources':
        return 'Ingestion & Data Sources';
      case 'settings':
        return 'Configuration & Heuristics';
      default:
        return 'KryptonX Workstation';
    }
  };

  const handleSelectEvent = (id: string | null) => {
    setSelectedEventId(id);
    if (id && currentTab !== 'dashboard' && currentTab !== 'events' && currentTab !== 'map') {
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-bg-main text-text-primary overflow-hidden font-sans">
      {/* Fixed Left Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Main Workstation Canvas */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <TopBar
          title={getPageTitle()}
          isLive={false} // Demo data mode per SIH prototype spec
          onRefresh={() => setRefreshKey((k) => k + 1)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          region={region}
          onRegionChange={setRegion}
        />

        {/* Page Switcher */}
        <main className="flex-1 overflow-hidden" key={refreshKey}>
          {currentTab === 'dashboard' && (
            <MissionControlPage
              selectedEventId={selectedEventId}
              onSelectEventId={handleSelectEvent}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'events' && (
            <EventsPage
              onSelectEventId={handleSelectEvent}
            />
          )}

          {currentTab === 'map' && (
            <MapPage
              onSelectEventId={handleSelectEvent}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage
              onSelectEventId={handleSelectEvent}
            />
          )}

          {currentTab === 'sources' && (
            <DataSourcesPage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
