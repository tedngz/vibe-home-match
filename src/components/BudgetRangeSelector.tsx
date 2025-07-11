
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BudgetRangeSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const BudgetRangeSelector = ({ value, onChange }: BudgetRangeSelectorProps) => {
  const { formatPrice, convertPrice } = useCurrency();
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const PRESET_RANGES = [
    { label: 'Budget', range: [3000000, 8000000] as [number, number] },
    { label: 'Mid-range', range: [8000000, 15000000] as [number, number] },
    { label: 'Premium', range: [15000000, 25000000] as [number, number] },
    { label: 'Luxury', range: [25000000, 40000000] as [number, number] },
  ];

  const handlePresetClick = (preset: typeof PRESET_RANGES[0]) => {
    onChange(preset.range);
    setActivePreset(preset.label);
  };

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue as [number, number]);
    setActivePreset(null);
  };

  return (
    <div className="space-y-8">
      {/* Currency Selector */}
      <div className="text-center">
        <Label className="text-base font-medium text-slate-900 mb-4 block">Currency</Label>
        <CurrencySelector />
      </div>

      {/* Sleek Budget Display */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm font-medium opacity-90 mb-2">Your Budget Range</div>
          <div className="text-2xl font-bold">
            {formatPrice(value[0])} - {formatPrice(value[1])}
          </div>
          <div className="text-sm opacity-80 mt-1">per month</div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-4">
        <Label className="text-base font-medium text-slate-900 block text-center">Quick Selection</Label>
        <div className="grid grid-cols-2 gap-3">
          {PRESET_RANGES.map((preset) => (
            <Button
              key={preset.label}
              variant={activePreset === preset.label ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className={`transition-all duration-200 h-auto py-3 ${
                activePreset === preset.label
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg border-none'
                  : 'hover:bg-orange-50 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{preset.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {formatPrice(preset.range[0])} - {formatPrice(preset.range[1])}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Slider */}
      <div className="space-y-6">
        <Label className="text-base font-medium text-slate-900 block text-center">Custom Range</Label>
        <div className="px-4">
          <div className="relative">
            <Slider
              value={value}
              onValueChange={handleSliderChange}
              max={40000000}
              min={3000000}
              step={500000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600 mt-3 font-medium">
              <div className="text-center">
                <div className="font-semibold">{formatPrice(value[0])}</div>
                <div className="text-xs opacity-75">Minimum</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatPrice(value[1])}</div>
                <div className="text-xs opacity-75">Maximum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
