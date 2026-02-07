import { useState } from "react";
import { FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  buttonText: string;
  options: FilterOption[];
  currentValue: string;
  onSelect: (value: string) => void;
  allValue?: string;
}

const FilterDropdown = ({
  label,
  buttonText,
  options,
  currentValue,
  onSelect,
  allValue = "ALL",
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = currentValue !== allValue;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center h-full gap-2 px-6 py-3.5 rounded-2xl font-bold border transition-all ${
          isActive || isOpen
            ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
      >
        <FaFilter size={14} />
        <span className="text-xs">{isActive ? currentValue : buttonText}</span>
        
        {isActive && (
          <span className="bg-white text-brand-blue rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
            1
          </span>
        )}
        
        <FaChevronDown 
          size={12} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute left-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6 space-y-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-black text-gray-800 text-xs uppercase tracking-widest">
                Refinar Busca
              </span>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-gray-600">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {label}
              </label>
              <div className="flex flex-col gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSelect(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      currentValue === opt.value
                        ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                        : "bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isActive && (
              <button
                onClick={() => {
                  onSelect(allValue);
                  setIsOpen(false);
                }}
                className="w-full py-3 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <FaTimes size={12} /> LIMPAR FILTRO
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;