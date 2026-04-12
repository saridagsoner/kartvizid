
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
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-[440px] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
          <h2 className="text-lg font-black text-black dark:text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl text-black dark:text-white hover:bg-[#1f6d78] hover:text-white transition-all"
          >
            <i className="fi fi-br-cross text-[10px]"></i>
          </button>
        </div>

        <div className="px-6 pt-5 pb-1">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity dark:stroke-white" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Listede ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-full py-2.5 pl-10 pr-6 outline-none text-[13px] font-bold border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="p-3 max-h-[320px] overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {filtered.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(item.label)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group"
                >
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">{item.label}</span>
                  {item.count > 0 && (
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-black text-gray-400 group-hover:bg-[#1f6d78] group-hover:text-white transition-all uppercase tracking-tighter">
                      {item.count}
                    </span>
                  )}
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
