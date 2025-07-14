
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
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrency(currency === 'VND' ? 'USD' : 'VND')}
      className="h-8 min-w-[60px]"
    >
      {currency === 'VND' ? '₫' : '$'} {currency}
    </Button>
  );
};
