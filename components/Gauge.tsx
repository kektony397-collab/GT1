
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeProps {
  value: number;
  maxValue: number;
  label: string;
  color: 'cyan' | 'red';
}

const Gauge: React.FC<GaugeProps> = ({ value, maxValue, label, color }) => {
  const percentage = (value / maxValue) * 100;
  const data = [{ name: 'value', value: percentage }];
  const fill = color === 'cyan' ? '#22d3ee' : '#f87171';
  const shadow = color === 'cyan' ? 'drop-shadow(0 0 8px #22d3ee)' : 'drop-shadow(0 0 8px #f87171)';

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            fill={fill}
            cornerRadius={10}
            style={{ filter: shadow }}
          />
          <defs>
            <radialGradient id="radial-gradient-bg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(17, 24, 39, 0.1)" />
              <stop offset="100%" stopColor="rgba(17, 24, 39, 0.6)" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="68%" fill="url(#radial-gradient-bg)" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tighter" style={{ textShadow: `0 0 10px ${fill}` }}>
          {Math.round(value)}
        </span>
        <span className="text-lg sm:text-xl text-cyan-300 -mt-1">{label}</span>
      </div>
    </div>
  );
};

export default Gauge;
