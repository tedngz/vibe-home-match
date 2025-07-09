
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
    { code: 'USD', symbol: '$', label: 'US Dollar' }
  ];

  return (
    <div className="flex items-center space-x-2">
      {currencies.map((curr) => (
        <Button
          key={curr.code}
          variant={currency === curr.code ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrency(curr.code)}
          className="h-8"
        >
          {curr.symbol} {curr.code}
        </Button>
      ))}
    </div>
  );
};
