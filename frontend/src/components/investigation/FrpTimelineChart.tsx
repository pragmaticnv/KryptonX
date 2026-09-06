import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';
import { ObservationPoint } from '../../types/event';

interface FrpTimelineChartProps {
  timeline: ObservationPoint[];
  baselineFrp: number;
  peakFrp: number;
}

export const FrpTimelineChart: React.FC<FrpTimelineChartProps> = ({
  timeline,
  baselineFrp,
  peakFrp,
}) => {
  // Format timeline data points
  const chartData = timeline.map((pt) => {
    let formattedTime = pt.time;
    if (pt.time.includes('T')) {
      formattedTime = pt.time.split('T')[1].slice(0, 5);
    }
    return {
      time: formattedTime,
      frp: pt.frp,
      baseline: baselineFrp,
    };
  });

  return (
    <div className="bg-bg-secondary/70 border border-border-subtle rounded p-3 select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-text-primary uppercase tracking-wider">
            FRP INTENSITY TRAJECTORY
          </span>
          <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1.5 py-0.2 rounded border border-cyan/30">
            MW RADIATIVE POWER
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan"></span>
            <span className="text-text-muted">Observed FRP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-warning border-b border-dashed border-warning"></span>
            <span className="text-warning">Baseline ({baselineFrp} MW)</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="frpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#19C7D8" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#19C7D8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A374F" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#5A7588"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis
              stroke="#5A7588"
              fontSize={10}
              tickLine={false}
              domain={[0, Math.max(60, Math.ceil(peakFrp * 1.25))]}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E2438',
                borderColor: '#1A374F',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#EAF4F7',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
              formatter={(val: number, name: string) => [
                `${val.toFixed(1)} MW`,
                name === 'frp' ? 'Observed FRP' : 'Historical Baseline'
              ]}
              labelFormatter={(label) => `Acquisition: ${label} UTC`}
            />
            <ReferenceLine
              y={baselineFrp}
              stroke="#FF9F1C"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="frp"
              stroke="#19C7D8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#frpGradient)"
            />
            <Line
              type="monotone"
              dataKey="frp"
              stroke="#19C7D8"
              strokeWidth={2.5}
              dot={{ fill: '#19C7D8', r: 3, strokeWidth: 1, stroke: '#071521' }}
              activeDot={{ r: 5, fill: '#EAF4F7', stroke: '#19C7D8', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[9px] font-mono text-text-dim text-right mt-1">
        Satellite: VIIRS 375m NRT • Continuous temporal trajectory
      </div>
    </div>
  );
};
