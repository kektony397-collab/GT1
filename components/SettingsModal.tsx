import React, { useState } from 'react';
import Modal from './Modal';
import type { Settings } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  settings: Settings;
  setEconomy: (economy: number) => void;
  setReserve: (liters: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, settings, setEconomy, setReserve }) => {
  const [economy, setLocalEconomy] = useState(settings.fuelEconomyKmPerL.toString());
  const [reserve, setLocalReserve] = useState(settings.reserveLiters.toString());

  const handleSave = () => {
    const newEconomy = parseFloat(economy);
    const newReserve = parseFloat(reserve);

    // Validate before saving to prevent NaN or invalid values from corrupting state
    if (!isNaN(newEconomy) && newEconomy > 0) {
      setEconomy(newEconomy);
    }
    if (!isNaN(newReserve) && newReserve >= 0.1 && newReserve <= 5) {
      setReserve(newReserve);
    }

    onClose();
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label htmlFor="fuel-economy" className="block text-sm font-medium text-cyan-200">
            Fuel Economy (km/L)
          </label>
          <input
            type="number"
            id="fuel-economy"
            value={economy}
            onChange={(e) => setLocalEconomy(e.target.value)}
            min="1"
            step="0.1"
            className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. 44.0"
          />
          <p className="text-xs text-gray-400 mt-1">Set your bike's average mileage.</p>
        </div>
        <div>
          <label htmlFor="reserve-liters" className="block text-sm font-medium text-cyan-200">
            Reserve Fuel Warning (Liters)
          </label>
          <input
            type="number"
            id="reserve-liters"
            value={reserve}
            onChange={(e) => setLocalReserve(e.target.value)}
            min="0.1"
            max="5"
            step="0.1"
            className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g. 1.5"
          />
           <p className="text-xs text-gray-400 mt-1">Get a notification when fuel drops to this level.</p>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;