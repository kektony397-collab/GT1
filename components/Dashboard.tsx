
import React from 'react';
import type { useBikeState } from '../hooks/useBikeState';
import Gauge from './Gauge';
import StatCard from './StatCard';
import { Road, Gauge as GaugeIcon, GasPump } from './Icons';

type DashboardProps = ReturnType<typeof useBikeState>;

const Dashboard: React.FC<DashboardProps> = ({
  state,
  locationState,
  estimatedRangeKm,
  fuelPercentage,
  isReserve,
  resetTrip
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Speedometer */}
      <div className="md:col-span-2 p-4 sm:p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-center aspect-square md:aspect-auto">
        <h2 className="text-lg font-bold text-cyan-400 mb-4">SPEED</h2>
        <div className="relative w-full h-full max-w-sm flex items-center justify-center">
            <Gauge 
              value={locationState.speedKph} 
              maxValue={160} 
              label="km/h" 
              color="cyan"
            />
        </div>
      </div>
      
      {/* Fuel Gauge */}
      <div className="p-4 sm:p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-center aspect-square md:aspect-auto">
        <h2 className={`text-lg font-bold mb-4 ${isReserve ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>FUEL</h2>
        <div className="relative w-full h-full max-w-xs flex items-center justify-center">
             <Gauge 
               value={fuelPercentage} 
               maxValue={100} 
               label="%"
               color={isReserve ? "red" : "cyan"}
             />
        </div>
      </div>

      {/* Stats */}
      <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={<Road className="w-8 h-8 text-cyan-400" />}
          label="Total Odometer"
          value={state.totalOdometerKm.toFixed(1)}
          unit="km"
        />
        <StatCard
          icon={<GaugeIcon className="w-8 h-8 text-cyan-400" />}
          label="Trip"
          value={state.tripKm.toFixed(1)}
          unit="km"
          onReset={resetTrip}
        />
        <StatCard
          icon={<GasPump className="w-8 h-8 text-cyan-400" />}
          label="Current Fuel"
          value={state.currentFuelL.toFixed(2)}
          unit="L"
        />
        <StatCard
          icon={<MapPin className="w-8 h-8 text-cyan-400" />}
          label="Est. Range"
          value={estimatedRangeKm.toFixed(0)}
          unit="km"
        />
      </div>
    </div>
  );
};

// Re-defining MapPin here because it's used in StatCard
const MapPin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);


export default Dashboard;
