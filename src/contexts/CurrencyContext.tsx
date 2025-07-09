
import React, { createContext, useContext, useState } from 'react';

export type Currency = 'VND' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (priceInVND: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// 1 USD = 24,500 VND (approximate exchange rate)
const VND_TO_USD_RATE = 24500;

const currencySymbols = {
  VND: '₫',
  USD: '$'
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('VND');

  const convertPrice = (priceInVND: number) => {
    if (currency === 'VND') {
      return priceInVND;
    } else {
      return Math.round(priceInVND / VND_TO_USD_RATE);
    }
  };

  const formatPrice = (priceInVND: number) => {
    const convertedPrice = convertPrice(priceInVND);
    const symbol = currencySymbols[currency];
    
    if (currency === 'VND') {
      // Format VND in millions for readability
      if (convertedPrice >= 1000000) {
        return `${(convertedPrice / 1000000).toFixed(1)}M ${symbol}`;
      } else {
        return `${convertedPrice.toLocaleString()} ${symbol}`;
      }
    } else {
      return `${symbol}${convertedPrice.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
