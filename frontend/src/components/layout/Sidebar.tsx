import React from 'react';
import { 
  Radar, 
  Flame, 
  BarChart3, 
  Map, 
  Database, 
  Settings, 
  ShieldAlert,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Mission Control', icon: Radar, code: '01' },
    { id: 'events', label: 'Thermal Events', icon: Flame, code: '02' },
    { id: 'map', label: 'Tactical Map', icon: Map, code: '03' },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, code: '04' },
    { id: 'sources', label: 'Data Sources', icon: Database, code: '05' },
    { id: 'settings', label: 'Settings', icon: Settings, code: '06' },
  ];

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border-subtle flex flex-col h-screen select-none shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-border-subtle bg-bg-panel/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan shadow-sm shadow-cyan/20">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-xl tracking-wider text-text-primary">KRYPTON<span className="text-cyan">X</span></span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan/20 text-cyan rounded border border-cyan/40">PROTOTYPE</span>
            </div>
            <div className="text-[10px] tracking-wider text-text-muted font-mono uppercase">
              SIH26162 // THERMAL AI
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono tracking-wider text-text-dim uppercase">
          WORKSPACE WORKSTATION
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan/15 text-cyan border border-cyan/40 shadow-sm shadow-cyan/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-panel/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono ${isActive ? 'text-cyan/70' : 'text-text-dim'}`}>
                {item.code}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Threat Level & System Telemetry Footer */}
      <div className="p-3.5 border-t border-border-subtle bg-bg-panel/30 space-y-2.5">
        <div className="bg-bg-panel border border-border-subtle rounded p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-text-muted font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-critical" />
              PRIORITY ENGINE
            </span>
            <span className="text-[10px] font-mono text-cyan">ACTIVE</span>
          </div>
          <div className="text-[11px] font-mono text-text-primary flex justify-between">
            <span>Critical Anomaly:</span>
            <span className="text-critical font-bold">EVT-1048 (3.7×)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-text-dim px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            LATENCY: 28ms
          </span>
          <span>v0.1.0-RC</span>
        </div>
      </div>
    </aside>
  );
};
