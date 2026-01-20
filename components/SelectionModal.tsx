
import React, { useState } from 'react';
import { PopularItem } from '../types';

interface SelectionModalProps {
  title: string;
  items: PopularItem[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ title, items, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  const filtered = (items || []).filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-black tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-all"
          >
            ×
          </button>
        </div>

        <div className="px-8 pt-6 pb-2">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Listede ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 rounded-full py-3.5 pl-12 pr-6 outline-none text-sm font-bold border border-transparent focus:border-black/10 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {filtered.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(item.label)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group"
                >
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">{item.label}</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-black text-gray-400 group-hover:bg-black group-hover:text-white transition-all uppercase tracking-tighter">
                    {item.count} Aday
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm font-bold italic">Aradığınız kriterde sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
