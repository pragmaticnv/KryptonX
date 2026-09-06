import React, { useState, useEffect } from 'react';
import { Database, Radio, CheckCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { SourcesStatus } from '../types/event';
import { ApiService } from '../services/api';
import { DEFAULT_SOURCES } from '../data/seedData';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<SourcesStatus>(DEFAULT_SOURCES);

  useEffect(() => {
    ApiService.getSourcesStatus().then(setSources);
  }, []);

  const sourceList = [
    {
      key: 'firms',
      title: sources.firms.name,
      purpose: sources.firms.purpose,
      mode: sources.firms.mode,
      status: sources.firms.status,
      lastUpdate: sources.firms.last_update,
      details: sources.firms.details,
      badgeColor: sources.firms.mode === 'live' ? 'text-success bg-success/15 border-success/40' : 'text-warning bg-warning/15 border-warning/40',
    },
    {
      key: 'osm',
      title: sources.osm.name,
      purpose: sources.osm.purpose,
      mode: sources.osm.mode,
      status: sources.osm.status,
      lastUpdate: sources.osm.last_update,
      details: sources.osm.details,
      badgeColor: 'text-cyan bg-cyan/15 border-cyan/40',
    },
    {
      key: 'worldcover',
      title: sources.worldcover.name,
      purpose: sources.worldcover.purpose,
      mode: sources.worldcover.mode,
      status: sources.worldcover.status,
      lastUpdate: sources.worldcover.last_update,
      details: sources.worldcover.details,
      badgeColor: 'text-kxblue bg-kxblue/15 border-kxblue/40',
    },
    {
      key: 'historical',
      title: sources.historical.name,
      purpose: sources.historical.purpose,
      mode: sources.historical.mode,
      status: sources.historical.status,
      lastUpdate: sources.historical.last_update,
      details: sources.historical.details,
      badgeColor: 'text-cyan bg-cyan/15 border-cyan/40',
    },
    {
      key: 'copernicus',
      title: sources.copernicus.name,
      purpose: sources.copernicus.purpose,
      mode: sources.copernicus.mode,
      status: sources.copernicus.status,
      lastUpdate: 'Scheduled Phase 2',
      details: sources.copernicus.details,
      badgeColor: 'text-text-dim bg-bg-secondary border-border-subtle',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-bg-main p-5 font-mono space-y-5">
      <div>
        <h2 className="text-base font-bold text-text-primary uppercase flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan" />
          Ingestion Feeds & Data Source Telemetry
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time status of satellite observations, geospatial infrastructure overlays, and historical anomaly baselines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourceList.map((src) => (
          <div
            key={src.key}
            className="bg-bg-panel border border-border-subtle rounded p-4 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  {src.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${src.badgeColor}`}>
                  ● {src.mode.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-cyan mt-1">
                {src.purpose}
              </div>
              <div className="text-xs text-text-muted mt-2 leading-relaxed">
                {src.details}
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-dim">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span>INTEGRITY: NORMAL</span>
              </span>
              <span>SYNC: {src.lastUpdate ? new Date(src.lastUpdate).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
