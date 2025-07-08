
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface BudgetRangeSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PRESET_RANGES = [
  { label: 'Budget', range: [500, 1500] as [number, number] },
  { label: 'Mid-range', range: [1500, 3000] as [number, number] },
  { label: 'Premium', range: [3000, 5000] as [number, number] },
  { label: 'Luxury', range: [5000, 8000] as [number, number] },
];

export const BudgetRangeSelector = ({ value, onChange }: BudgetRangeSelectorProps) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handlePresetClick = (preset: typeof PRESET_RANGES[0]) => {
    onChange(preset.range);
    setActivePreset(preset.label);
  };

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue as [number, number]);
    setActivePreset(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium text-slate-900 mb-4 block">Quick Budget Selection</Label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_RANGES.map((preset) => (
            <Button
              key={preset.label}
              variant={activePreset === preset.label ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className={`transition-all duration-200 ${
                activePreset === preset.label
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs opacity-75">${preset.range[0]}-${preset.range[1]}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium text-slate-900">Custom Range</Label>
        <div className="px-3">
          <Slider
            value={value}
            onValueChange={handleSliderChange}
            max={8000}
            min={500}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-600 mt-2 font-medium">
            <span>${value[0]}</span>
            <span>${value[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
