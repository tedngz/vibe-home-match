
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, RotateCcw, LogOut, User, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

interface UserMenuProps {
  userType: 'renter' | 'realtor';
  onSwitchUserType: () => void;
  onRestartOnboarding?: () => void;
}

export const UserMenu = ({ userType, onSwitchUserType, onRestartOnboarding }: UserMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
    { code: 'USD', symbol: '$', label: 'US Dollar' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-gray-200">
        {/* Currency Selection */}
        <div className="px-2 py-1.5">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Currency</span>
          </div>
          <div className="flex space-x-1">
            {currencies.map((curr) => (
              <Button
                key={curr.code}
                variant={currency === curr.code ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency(curr.code)}
                className="h-7 text-xs flex-1"
              >
                {curr.symbol} {curr.code}
              </Button>
            ))}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {onRestartOnboarding && (
          <>
            <DropdownMenuItem onClick={onRestartOnboarding}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Quiz
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={onSwitchUserType}>
          <User className="w-4 h-4 mr-2" />
          Switch to {userType === 'renter' ? 'Realtor' : 'Renter'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
