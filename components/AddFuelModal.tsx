import React, { useState } from 'react';
import Modal from './Modal';

interface AddFuelModalProps {
  onClose: () => void;
  onAddFuel: (liters: number) => void;
  tankCapacity: number;
  currentFuel: number;
}

const QuickAddButton: React.FC<{onClick: () => void, disabled: boolean, children: React.ReactNode}> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-center py-2 px-1 border border-cyan-700 rounded-md text-cyan-200 hover:bg-cyan-600/50 hover:text-white transition-colors disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);


const AddFuelModal: React.FC<AddFuelModalProps> = ({ onClose, onAddFuel, tankCapacity, currentFuel }) => {
  const maxFuelToAdd = tankCapacity - currentFuel;
  // Initialize with a sensible default, like 5L or whatever is left to fill up, whichever is smaller.
  const [liters, setLiters] = useState(Math.max(0, Math.min(5, maxFuelToAdd)).toFixed(2));

  const handleAddFuel = () => {
    const amount = parseFloat(liters);
    if (!isNaN(amount) && amount > 0) {
      onAddFuel(amount);
      onClose();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty input for typing, but clamp value
    const value = e.target.value;
    if (value === '') {
        setLiters('');
        return;
    }
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
        const clampedValue = Math.max(0, Math.min(numericValue, maxFuelToAdd));
        // Avoid changing the user's input if they are typing a decimal, e.g. "5."
        if (numericValue.toString() !== value && value.slice(-1) !== '.') {
             setLiters(clampedValue.toString());
        } else {
             setLiters(value);
        }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiters(parseFloat(e.target.value).toFixed(2));
  };

  const setAmount = (amount: number) => {
    const clampedAmount = Math.max(0, Math.min(amount, maxFuelToAdd));
    setLiters(clampedAmount.toFixed(2));
  };


  return (
    <Modal title="Add Fuel" onClose={onClose}>
      <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
                Quick Add
            </label>
            <div className="grid grid-cols-4 gap-2 text-sm">
                <QuickAddButton onClick={() => setAmount(1)} disabled={1 > maxFuelToAdd}>1 L</QuickAddButton>
                <QuickAddButton onClick={() => setAmount(2)} disabled={2 > maxFuelToAdd}>2 L</QuickAddButton>
                <QuickAddButton onClick={() => setAmount(5)} disabled={5 > maxFuelToAdd}>5 L</QuickAddButton>
                <QuickAddButton onClick={() => setAmount(maxFuelToAdd)} disabled={maxFuelToAdd < 0.01}>Fill Tank</QuickAddButton>
            </div>
        </div>
      
        <div>
          <label htmlFor="fuel-amount" className="block text-sm font-medium text-cyan-200 mb-1">
            Liters to Add
          </label>
          <div className="flex items-center space-x-2">
              <input
                  type="number"
                  id="fuel-amount"
                  value={liters}
                  onChange={handleInputChange}
                  onBlur={() => setLiters(parseFloat(liters || '0').toFixed(2))} // Format on blur
                  min="0"
                  max={maxFuelToAdd.toFixed(2)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
              />
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
        <p className="text-xs text-gray-400 text-center">
          Tank: {currentFuel.toFixed(2)} / {tankCapacity} L | Max to add: {maxFuelToAdd.toFixed(2)} L
        </p>
        <button
          onClick={handleAddFuel}
          disabled={parseFloat(liters || '0') <= 0 || parseFloat(liters || '0') > maxFuelToAdd}
          className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-lg"
        >
          Confirm Add {parseFloat(liters || '0').toFixed(2)} L
        </button>
      </div>
    </Modal>
  );
};

export default AddFuelModal;
