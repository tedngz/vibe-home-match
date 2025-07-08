
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronRight } from 'lucide-react';

interface CityDistrictSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CITIES_WITH_DISTRICTS = {
  'Ho Chi Minh City': [
    'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
    'District 7', 'District 10', 'Binh Thanh', 'Tan Binh', 'Thu Duc'
  ],
  'Hanoi': [
    'Ba Dinh', 'Hoan Kiem', 'Hai Ba Trung', 'Dong Da', 'Tay Ho',
    'Cau Giay', 'Thanh Xuan', 'Hoang Mai', 'Long Bien', 'Nam Tu Liem'
  ],
  'Da Nang': [
    'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son', 'Lien Chieu',
    'Cam Le', 'Hoa Vang'
  ]
};

const CITY_FLAGS = {
  'Ho Chi Minh City': '🇻🇳',
  'Hanoi': '🇻🇳',
  'Da Nang': '🇻🇳'
};

export const CityDistrictSelector = ({ value, onChange }: CityDistrictSelectorProps) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showDistricts, setShowDistricts] = useState(false);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setShowDistricts(true);
  };

  const handleDistrictClick = (district: string) => {
    onChange(`${district}, ${selectedCity}`);
    setShowDistricts(false);
  };

  const handleBack = () => {
    setShowDistricts(false);
    setSelectedCity(null);
  };

  if (showDistricts && selectedCity) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Button>
          <div>
            <h4 className="font-medium text-slate-900">Select District in {selectedCity}</h4>
            <p className="text-sm text-slate-600">Choose your preferred area</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {CITIES_WITH_DISTRICTS[selectedCity as keyof typeof CITIES_WITH_DISTRICTS].map(district => (
            <Button
              key={district}
              variant={value.includes(district) ? 'default' : 'outline'}
              className={`justify-start p-3 transition-all duration-200 ${
                value.includes(district)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'hover:bg-orange-50 hover:border-orange-300'
              }`}
              onClick={() => handleDistrictClick(district)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {district}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-slate-900 mb-2">Select City</h4>
        <p className="text-sm text-slate-600 mb-4">Choose your preferred location</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(CITY_FLAGS).map(([city, flag]) => (
          <Button
            key={city}
            variant="outline"
            className="justify-between p-4 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
            onClick={() => handleCityClick(city)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{flag}</span>
              <span className="font-medium">{city}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};
