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
  const maxFuelToAdd = Math.max(0, tankCapacity - currentFuel);
  const [liters, setLiters] = useState(Math.min(5, maxFuelToAdd).toFixed(2));

  // Parse the string value once for cleaner logic
  const amountToAdd = parseFloat(liters);
  const isValidAmount = !isNaN(amountToAdd) && amountToAdd > 0 && amountToAdd <= maxFuelToAdd;

  const handleAddFuel = () => {
    if (isValidAmount) {
      onAddFuel(amountToAdd);
      onClose();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow typing numbers and a decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue > maxFuelToAdd) {
            setLiters(maxFuelToAdd.toFixed(2));
        } else {
            setLiters(value);
        }
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(liters);
    // If input is invalid or zero, reset to "0.00"
    if (isNaN(parsed) || parsed <= 0) {
        setLiters('0.00');
    } else {
        // Otherwise, clamp to the max and format to 2 decimal places
        const clamped = Math.min(parsed, maxFuelToAdd);
        setLiters(clamped.toFixed(2));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiters(parseFloat(e.target.value).toFixed(2));
  };

  const setAmount = (amount: number) => {
    const clampedAmount = Math.min(amount, maxFuelToAdd);
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
                  onBlur={handleBlur}
                  min="0"
                  max={maxFuelToAdd.toFixed(2)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00"
              />
          </div>
        </div>
        <div>
            <input
                type="range"
                min="0"
                max={maxFuelToAdd.toFixed(2)}
                step="0.01"
                value={isNaN(amountToAdd) ? 0 : amountToAdd}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
        </div>
        <p className="text-xs text-gray-400 text-center">
          Tank: {currentFuel.toFixed(2)} / {tankCapacity} L | Max to add: {maxFuelToAdd.toFixed(2)} L
        </p>
        <button
          onClick={handleAddFuel}
          disabled={!isValidAmount}
          className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-lg"
        >
          Confirm Add {(!isNaN(amountToAdd) && amountToAdd > 0) ? amountToAdd.toFixed(2) : '0.00'} L
        </button>
      </div>
    </Modal>
  );
};

export default AddFuelModal;