import React, { useState, createContext, useContext, useRef, useCallback } from 'react';

// --- Mock Dependencies (Re-introduced to fix build errors) ---
// These are mock implementations to make the code self-contained and runnable,
// as the original project's components and contexts are not available in this environment.

// 1. Mock Currency Context, Provider, and Hook
const CurrencyContext = createContext(null);

const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('VND');
    const [exchangeRates] = useState({
        INR: 1,
        USD: 0.012,
        VND: 300,
    });

    const formatPrice = (priceInInr) => {
        const rate = exchangeRates[currency] || 1;
        let price = priceInInr * rate;

        if (currency === 'VND') {
            price = Math.round(price / 500000) * 500000;
        } else {
            price = Math.round(price / 10) * 10;
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const value = { currency, setCurrency, formatPrice };
    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

// 2. Mock UI Components (Button, Slider, Label, CurrencySelector)
const Button = ({ children, className, variant, ...props }) => (
    <button className={className} {...props}>
        {children}
    </button>
);

const Label = ({ children, className, ...props }) => (
    <label className={className} {...props}>
        {children}
    </label>
);

const CurrencySelector = () => {
    const { currency, setCurrency } = useCurrency();
    return (
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-auto p-2.5 mx-auto"
        >
            <option value="VND">VND (₫)</option>
            <option value="USD">USD ($)</option>
        </select>
    );
};

const Slider = ({ value, onValueChange, max, min, step }) => {
    const [minVal, maxVal] = value;
    const trackRef = useRef(null);

    const getPercentage = useCallback((val) => ((val - min) / (max - min)) * 100, [min, max]);
    
    const minPercent = getPercentage(minVal);
    const maxPercent = getPercentage(maxVal);

    const handleThumbMove = (e, thumb) => {
        if (!trackRef.current) return;
        
        const trackRect = trackRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const offsetX = clientX - trackRect.left;
        let newValue = min + (offsetX / trackRect.width) * (max - min);
        
        newValue = Math.round(newValue / step) * step;

        if (thumb === 'min') {
            const newMin = Math.max(min, Math.min(newValue, maxVal - step));
            onValueChange([newMin, maxVal]);
        } else {
            const newMax = Math.min(max, Math.max(newValue, minVal + step));
            onValueChange([minVal, newMax]);
        }
    };

    const addEventListeners = (thumb) => (e) => {
        e.preventDefault();
        const onMouseMove = (moveEvent) => handleThumbMove(moveEvent, thumb);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove);
        document.addEventListener('touchend', onMouseUp);
    };

    return (
        <div ref={trackRef} className="relative w-full h-2 bg-gray-200 rounded-full my-6">
            <div 
                className="absolute h-2 bg-orange-500 rounded-full"
                style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            ></div>
            <div
                onMouseDown={addEventListeners('min')}
                onTouchStart={addEventListeners('min')}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-pointer"
                style={{ left: `${minPercent}%`, transform: 'translate(-50%, -50%)' }}
            ></div>
            <div
                onMouseDown={addEventListeners('max')}
                onTouchStart={addEventListeners('max')}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-pointer"
                style={{ left: `${maxPercent}%`, transform: 'translate(-50%, -50%)' }}
            ></div>
        </div>
    );
};


// --- Budget Range Selector Component ---
// This component now uses the mock dependencies defined above.
const BudgetRangeSelector = ({ budget, onBudgetChange, activePreset, onPresetChange }) => {
  const { formatPrice } = useCurrency();

  const PRESET_RANGES = [
    { label: 'Budget', range: [16667, 33333] },
    { label: 'Mid-range', range: [33333, 83333] },
    { label: 'Premium', range: [83333, 166667] },
  ];
  
  const MIN_BUDGET_BASE = 16667;
  const MAX_BUDGET_BASE = 166667;
  const STEP_BASE = 1000;

  const handlePresetClick = (preset) => {
    onBudgetChange(preset.range);
    onPresetChange(preset.label);
  };

  const handleSliderChange = (newValue) => {
    onBudgetChange(newValue);
    onPresetChange(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl shadow-slate-200 font-sans">
      <div className="space-y-8">
        <div className="text-center">
          <Label className="text-base font-medium text-slate-900 mb-2 block">Currency</Label>
          <CurrencySelector />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-900 block text-center">Quick Selection</Label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_RANGES.map((preset) => (
              <Button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                variant={activePreset === preset.label ? 'default' : 'outline'}
                className={`transition-all duration-200 h-auto py-3 rounded-lg border ${
                  activePreset === preset.label
                    ? 'bg-orange-500 text-white shadow-lg border-orange-500'
                    : 'bg-white border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">{preset.label}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-900 block text-center">Custom Range</Label>
          <div className="px-4">
            <Slider
              value={budget}
              onValueChange={handleSliderChange}
              max={MAX_BUDGET_BASE}
              min={MIN_BUDGET_BASE}
              step={STEP_BASE}
            />
            <div className="flex justify-between text-sm text-slate-600 mt-4 font-medium">
              <div className="text-center">
                <div className="font-semibold text-orange-600">{formatPrice(budget[0])}</div>
                <div className="text-xs opacity-75 mt-1">Minimum</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{formatPrice(budget[1])}</div>
                <div className="text-xs opacity-75 mt-1">Maximum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Entry Point) ---
// This component provides the context and state management to make the app runnable.
export default function App() {
    const [budget, setBudget] = useState([33333, 83333]);
    const [activePreset, setActivePreset] = useState('Mid-range');

    return (
        <CurrencyProvider>
            <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
                <BudgetRangeSelector 
                    budget={budget} 
                    onBudgetChange={setBudget}
                    activePreset={activePreset}
                    onPresetChange={setActivePreset}
                />
            </div>
        </CurrencyProvider>
    );
}
