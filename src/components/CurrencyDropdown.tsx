import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { ChevronDown } from 'lucide-react';

export const CurrencyDropdown = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
    { code: 'USD', symbol: '$', label: 'US Dollar' }
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 min-w-[80px] flex items-center gap-1"
        >
          {currentCurrency?.symbol} {currentCurrency?.code}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={currency === curr.code ? 'bg-accent' : ''}
          >
            <span className="flex items-center gap-2">
              {curr.symbol} {curr.code}
              <span className="text-xs text-muted-foreground">{curr.label}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};