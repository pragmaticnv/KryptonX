import React, { useState } from 'react';
import { Settings, Shield, Server, Cpu, Check, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [firmsKey, setFirmsKey] = useState('');
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-bg-main p-5 font-mono space-y-5">
      <div>
        <h2 className="text-base font-bold text-text-primary uppercase flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan" />
          Workstation & Adapter Configuration
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          System telemetry, sensor adapters, and prototype inference thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FIRMS Ingestion Configuration */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 space-y-4">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
            NASA FIRMS INGESTION ADAPTER
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Configure backend map key. When empty, KryptonX operates safely in deterministic demo mode with the SIH reference dataset.
          </p>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-[11px] text-text-dim mb-1 uppercase">
                NASA FIRMS MAP KEY (SERVER-SIDE ENV)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                value={firmsKey}
                onChange={(e) => setFirmsKey(e.target.value)}
                className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-text-dim">
                Sensors: VIIRS 375m (S-NPP / NOAA-20) + MODIS
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/40 text-xs font-bold transition-colors"
              >
                {saveStatus ? 'SAVED TO ADAPTER' : 'UPDATE CONFIG'}
              </button>
            </div>
          </form>
        </div>

        {/* Prototype Methodology & Heuristics */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 space-y-3">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
            METHODOLOGY & RESPONSIBLE AI SPECIFICATION
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            KryptonX is an investigation decision-support platform designed to surface high-probability industrial fire anomalies.
          </p>

          <div className="bg-bg-secondary p-3 rounded border border-border-subtle/70 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-text-primary">
              <span>Baseline Definition:</span>
              <span className="text-cyan">Multi-overpass spatial rolling median</span>
            </div>
            <div className="flex items-center justify-between text-text-primary">
              <span>Anomaly Scale:</span>
              <span className="text-critical">&gt;2.5× High • &gt;4.0× Critical</span>
            </div>
            <div className="flex items-center justify-between text-text-primary">
              <span>Priority Function:</span>
              <span className="text-kxblue">30% Th + 25% An + 20% Pe + 15% Ex + 10% Ind</span>
            </div>
            <div className="flex items-center justify-between text-text-primary">
              <span>Classification:</span>
              <span className="text-warning">Evidence-weighted hybrid rules (8 classes)</span>
            </div>
          </div>

          <div className="text-[10px] text-text-dim italic">
            * All thresholds represent prototype heuristics developed for SIH26162 rapid demonstration.
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 space-y-3 lg:col-span-2">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
            SYSTEM DIAGNOSTICS & TELEMETRY
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle">
              <div className="text-[10px] text-text-dim">BACKEND STATUS</div>
              <div className="font-bold text-success mt-0.5">CONNECTED (PORT 8000)</div>
            </div>
            <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle">
              <div className="text-[10px] text-text-dim">SEED REPOSITORY</div>
              <div className="font-bold text-cyan mt-0.5">3 CORE DEMO EVENTS</div>
            </div>
            <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle">
              <div className="text-[10px] text-text-dim">UI VERSION</div>
              <div className="font-bold text-text-primary mt-0.5">v0.1.0-PROTOTYPE</div>
            </div>
            <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle">
              <div className="text-[10px] text-text-dim">MAP ENGINE</div>
              <div className="font-bold text-kxblue mt-0.5">MAPLIBRE GL 4.1.1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
