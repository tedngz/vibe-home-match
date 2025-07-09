
import React, { createContext, useContext, useState } from 'react';

export type Currency = 'VND' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const exchangeRates = {
  VND: 1,
  USD: 0.00004 // 1 VND = 0.00004 USD (approximate)
};

const currencySymbols = {
  VND: '₫',
  USD: '$'
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('VND');

  const convertPrice = (price: number) => {
    return Math.round(price * exchangeRates[currency]);
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    const symbol = currencySymbols[currency];
    
    if (currency === 'VND') {
      return `${(convertedPrice / 1000000).toFixed(1)}M ${symbol}`;
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
