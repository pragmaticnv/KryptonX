import React from 'react';
import { Search, RotateCw, Globe2, Clock, Radio } from 'lucide-react';

interface TopBarProps {
  title: string;
  isLive: boolean;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  region: string;
  onRegionChange: (r: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  isLive,
  onRefresh,
  searchQuery,
  onSearchChange,
  region,
  onRegionChange,
}) => {
  return (
    <header className="h-14 bg-bg-panel border-b border-border-subtle px-5 flex items-center justify-between z-10 select-none">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold tracking-wide text-text-primary uppercase font-mono">
          {title}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-text-dim">
          <span>/</span>
          <span>GEOSPATIAL INTELLIGENCE PLATFORM</span>
        </div>
      </div>

      {/* Controls & Status Strip */}
      <div className="flex items-center gap-3.5">
        {/* Region Selector */}
        <div className="flex items-center gap-2 bg-bg-secondary px-2.5 py-1 rounded border border-border-subtle text-xs font-mono text-text-muted">
          <Globe2 className="w-3.5 h-3.5 text-cyan" />
          <select 
            value={region} 
            onChange={(e) => onRegionChange(e.target.value)}
            aria-label="Filter events by geographic region"
            className="bg-transparent text-text-primary text-xs font-mono focus:outline-none cursor-pointer"
          >
            <option value="Western India Industrial Corridor" className="bg-bg-panel text-text-primary">Western Industrial Belt (GJ/MH)</option>
            <option value="Northern Industrial Belt" className="bg-bg-panel text-text-primary">Northern Industrial Belt (NCR/HR)</option>
            <option value="Eastern Mining & Steel Corridor" className="bg-bg-panel text-text-primary">Eastern Mineral Corridor (JH/OD)</option>
          </select>
        </div>

        {/* Time Window Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1 rounded border border-border-subtle text-xs font-mono text-text-muted">
          <Clock className="w-3.5 h-3.5 text-kxblue" />
          <span>WINDOW: 24H (VIIRS NRT)</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search EVT-ID or facility..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-48 xl:w-56 bg-bg-secondary border border-border-subtle rounded pl-8 pr-3 py-1 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-cyan/50 font-mono"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh Data & Satellite Ingestion"
          className="p-1.5 bg-bg-secondary hover:bg-bg-hover text-text-muted hover:text-cyan border border-border-subtle rounded transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* DATA STATUS INDICATOR - REQUIRED BY SPEC */}
        {isLive ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/15 border border-success/40 text-success text-[11px] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>LIVE FIRMS</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning/15 border border-warning/40 text-warning text-[11px] font-mono font-semibold" title="Synthetic demonstration records per hackathon demo mode">
            <Radio className="w-3.5 h-3.5 text-warning animate-pulse" />
            <span>DEMO DATA</span>
          </div>
        )}
      </div>
    </header>
  );
};
