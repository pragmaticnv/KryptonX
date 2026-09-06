import React from 'react';
import { Factory, MapPin, Compass, Navigation, AlertOctagon } from 'lucide-react';

interface ContextPanelProps {
  nearestFacility: string;
  facilityType: string;
  facilityDistanceKm: number;
  landCover: string;
  context?: {
    transport_access?: string;
    demographic_exposure?: string;
    [key: string]: any;
  };
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  nearestFacility,
  facilityType,
  facilityDistanceKm,
  landCover,
  context,
}) => {
  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-3 font-mono">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-cyan" />
        <span className="text-xs font-bold tracking-wider text-text-primary uppercase">
          GEOSPATIAL & INDUSTRIAL CONTEXT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70 space-y-1">
          <div className="text-[9px] text-text-dim uppercase flex items-center gap-1">
            <Factory className="w-3 h-3 text-cyan" />
            NEAREST FACILITY
          </div>
          <div className="font-semibold text-text-primary truncate" title={nearestFacility}>
            {nearestFacility}
          </div>
          <div className="text-[10px] text-text-muted">{facilityType}</div>
        </div>

        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70 space-y-1">
          <div className="text-[9px] text-text-dim uppercase flex items-center gap-1">
            <Navigation className="w-3 h-3 text-kxblue" />
            PROXIMITY DISTANCE
          </div>
          <div className="font-semibold text-text-primary">
            {facilityDistanceKm} <span className="text-xs font-normal text-text-muted">km</span>
          </div>
          <div className="text-[10px] text-text-muted">
            {facilityDistanceKm <= 1.0 ? 'Direct facility vicinity' : 'Regional boundary'}
          </div>
        </div>

        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70 space-y-1 col-span-2">
          <div className="text-[9px] text-text-dim uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3 text-warning" />
            LAND-COVER CLASS (ESA WORLDCOVER)
          </div>
          <div className="font-semibold text-text-primary">
            {landCover}
          </div>
          {context?.transport_access && (
            <div className="text-[10px] text-text-muted pt-1 border-t border-border-subtle/40">
              Access: {context.transport_access}
            </div>
          )}
        </div>
      </div>

      {/* Critical Uncertainty Note - Section 18 */}
      <div className="flex items-start gap-2 bg-critical/10 border border-critical/30 p-2.5 rounded text-[10px] text-critical/90 font-mono">
        <AlertOctagon className="w-4 h-4 shrink-0 text-critical mt-0.5" />
        <div className="leading-snug">
          <strong className="text-critical font-bold uppercase block">CRITICAL UNCERTAINTY NOTICE:</strong>
          Thermal observations alone do not confirm source type. KryptonX generates evidence-weighted probable source leads to accelerate ground-truth investigation.
        </div>
      </div>
    </div>
  );
};
