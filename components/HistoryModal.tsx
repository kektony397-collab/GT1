
import React from 'react';
import Modal from './Modal';
import type { RefuelRecord } from '../types';
import { Trash } from './Icons';

interface HistoryModalProps {
  onClose: () => void;
  records: RefuelRecord[];
  deleteRecord: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ onClose, records, deleteRecord }) => {
  return (
    <Modal title="Refuel History" onClose={onClose}>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {records.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No refuel records yet.</p>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
            >
              <div>
                <p className="font-bold text-white">{record.liters.toFixed(2)} L</p>
                <p className="text-xs text-cyan-300">
                  {new Date(record.timestamp).toLocaleString()}
                </p>
                 <p className="text-xs text-gray-400">
                  at {record.odometer.toFixed(1)} km
                </p>
              </div>
              <button
                onClick={() => deleteRecord(record.id)}
                className="p-2 text-red-400 hover:text-white hover:bg-red-500/30 rounded-full transition-colors"
                aria-label="Delete record"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default HistoryModal;
