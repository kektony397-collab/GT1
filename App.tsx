
import React, { useState } from 'react';
import { useBikeState } from './hooks/useBikeState';
import Dashboard from './components/Dashboard';
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';
import AddFuelModal from './components/AddFuelModal';
import { Fuel, Cog, History, MapPin } from './components/Icons';

type ModalType = 'fuel' | 'settings' | 'history' | null;

const App: React.FC = () => {
  const bikeState = useBikeState();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const { locationState } = bikeState;

  const renderGpsStatus = () => {
    if (locationState.permission === 'prompt') {
      return (
        <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>GPS permission required for live tracking.</span>
          <button
            onClick={bikeState.requestLocationPermission}
            className="ml-auto bg-yellow-500 text-gray-900 px-3 py-1 rounded-md font-bold hover:bg-yellow-400 transition-colors"
          >
            Grant
          </button>
        </div>
      );
    }
    if (locationState.permission === 'denied') {
      return (
        <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>GPS permission denied. Live tracking is disabled.</span>
        </div>
      );
    }
    if (locationState.error) {
       return (
        <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>GPS Error: {locationState.error}</span>
        </div>
      );
    }
    if (locationState.permission === 'granted') {
       return (
        <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>GPS Active. Tracking live distance and speed.</span>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-gray-900 text-cyan-300 p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">
          Smart Bike Dashboard
        </h1>
        <div className="text-right">
          <p className="text-lg text-white">{bikeState.bike.model}</p>
          <p className="text-sm text-cyan-400">{bikeState.bike.year}</p>
        </div>
      </header>

      <div className="mb-4">
        {renderGpsStatus()}
      </div>

      <main className="flex-grow">
        <Dashboard {...bikeState} />
      </main>

      <footer className="mt-6">
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <button onClick={() => setActiveModal('fuel')} className="flex flex-col items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 shadow-lg shadow-cyan-500/10">
            <Fuel className="w-8 h-8 mb-2" />
            <span className="font-bold">Add Fuel</span>
          </button>
          <button onClick={() => setActiveModal('settings')} className="flex flex-col items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 shadow-lg shadow-cyan-500/10">
            <Cog className="w-8 h-8 mb-2" />
            <span className="font-bold">Settings</span>
          </button>
          <button onClick={() => setActiveModal('history')} className="flex flex-col items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 shadow-lg shadow-cyan-500/10">
            <History className="w-8 h-8 mb-2" />
            <span className="font-bold">History</span>
          </button>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
            <p>NOTE: This is a web-based simulation. GPS data is obtained from your device's geolocation services if permission is granted.</p>
        </div>
      </footer>
      
      {activeModal === 'fuel' && <AddFuelModal onClose={() => setActiveModal(null)} onAddFuel={bikeState.addFuel} tankCapacity={bikeState.bike.tankCapacityL} currentFuel={bikeState.state.currentFuelL} />}
      {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal(null)} settings={bikeState.settings} setEconomy={bikeState.setEconomy} setReserve={bikeState.setReserve} />}
      {activeModal === 'history' && <HistoryModal onClose={() => setActiveModal(null)} records={bikeState.refuelRecords} deleteRecord={bikeState.deleteRecord} />}

    </div>
  );
};

export default App;
