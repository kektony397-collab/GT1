
import React, { useState } from 'react';
import Modal from './Modal';

interface AddFuelModalProps {
  onClose: () => void;
  onAddFuel: (liters: number) => void;
  tankCapacity: number;
  currentFuel: number;
}

const AddFuelModal: React.FC<AddFuelModalProps> = ({ onClose, onAddFuel, tankCapacity, currentFuel }) => {
  const maxFuelToAdd = tankCapacity - currentFuel;
  const [liters, setLiters] = useState(Math.max(0, Math.min(5, maxFuelToAdd)).toFixed(2));

  const handleAddFuel = () => {
    const amount = parseFloat(liters);
    if (!isNaN(amount) && amount > 0) {
      onAddFuel(amount);
      onClose();
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiters(parseFloat(e.target.value).toFixed(2));
  }

  return (
    <Modal title="Add Fuel" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label htmlFor="fuel-amount" className="block text-sm font-medium text-cyan-200 mb-1">
            Liters to Add
          </label>
          <div className="flex items-center space-x-2">
              <input
                  type="number"
                  id="fuel-amount"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  min="0"
                  max={maxFuelToAdd.toFixed(2)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
              <span className="text-lg font-bold text-white">{parseFloat(liters).toFixed(2)} L</span>
          </div>
        </div>
        <div>
            <input
                type="range"
                min="0"
                max={maxFuelToAdd.toFixed(2)}
                step="0.01"
                value={liters}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
        </div>
        <p className="text-xs text-gray-400">
          Tank capacity: {tankCapacity}L. Current fuel: {currentFuel.toFixed(2)}L. Max to add: {maxFuelToAdd.toFixed(2)}L.
        </p>
        <button
          onClick={handleAddFuel}
          disabled={parseFloat(liters) <= 0 || parseFloat(liters) > maxFuelToAdd}
          className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default AddFuelModal;
