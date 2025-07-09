import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MapPin, Sparkles, Search, Home, Eye } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { sampleProperties } from '@/data/sampleProperties';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences?: UserPreferences;
  onMatch?: (apartment: Apartment) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  apartments?: Apartment[];
  suggestions?: string[];
}

interface SearchResult {
  apartment: Apartment;
  matchScore: number;
  matchReasons: string[];
}

export const AIChatAgent = ({ isOpen, onClose, userPreferences, onMatch }: AIChatAgentProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'agent',
      content: "🏠 Hi! I'm your AI housing assistant. I can help you find apartments by analyzing descriptions, images, and tags from our property database. Try asking me something like 'Show me modern apartments with a balcony' or 'Find places perfect for working from home'.",
      suggestions: [
        "Show me apartments with a balcony",
        "Find modern loft spaces",
        "Properties good for families",
        "Places with home office setup"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const { formatPrice } = useCurrency();

  const analyzePropertyMatch = (apartment: Apartment, query: string, userPrefs?: UserPreferences): SearchResult => {
    const searchTerms = query.toLowerCase().split(/\s+/);
    let matchScore = 0;
    const matchReasons: string[] = [];

    // Analyze title, description, and highlights
    const textContent = [
      apartment.title,
      apartment.description,
      apartment.vibe,
      apartment.location,
      ...apartment.highlights
    ].join(' ').toLowerCase();

    // Direct keyword matching with scoring
    const keywordMatches = searchTerms.filter(term => textContent.includes(term));
    matchScore += keywordMatches.length * 15;

    if (keywordMatches.length > 0) {
      matchReasons.push(`Contains keywords: ${keywordMatches.join(', ')}`);
    }

    // Semantic matching for common property features
    const featureMap: { [key: string]: string[] } = {
      'balcony': ['balcony', 'terrace', 'outdoor space', 'patio'],
      'modern': ['modern', 'contemporary', 'sleek', 'minimalist'],
      'cozy': ['cozy', 'warm', 'comfortable', 'homey'],
      'luxury': ['luxury', 'premium', 'high-end', 'upscale'],
      'workspace': ['office', 'desk', 'work', 'study', 'productivity'],
      'kitchen': ['kitchen', 'cooking', 'culinary', 'chef'],
      'view': ['view', 'city view', 'river view', 'skyline'],
      'pet': ['pet', 'dog', 'cat', 'animal'],
      'gym': ['gym', 'fitness', 'exercise', 'workout'],
      'parking': ['parking', 'garage', 'car space'],
      'family': ['family', 'children', 'kids', 'spacious']
    };

    for (const [concept, keywords] of Object.entries(featureMap)) {
      if (searchTerms.includes(concept) || searchTerms.some(term => keywords.includes(term))) {
        const hasFeature = keywords.some(keyword => textContent.includes(keyword));
        if (hasFeature) {
          matchScore += 20;
          matchReasons.push(`Perfect for ${concept} needs`);
        }
      }
    }

    // User preference matching (if available)
    if (userPrefs) {
      const vibeScore = calculateVibeScore(apartment, userPrefs);
      matchScore += vibeScore.overall * 0.3; // Add 30% of vibe score
      
      if (vibeScore.overall > 70) {
        matchReasons.push(`${Math.round(vibeScore.overall)}% match with your preferences`);
      }

      // Location preference
      const locationMatch = userPrefs.location.some(loc => 
        apartment.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (locationMatch) {
        matchScore += 25;
        matchReasons.push('In your preferred area');
      }

      // Budget match
      const [minBudget, maxBudget] = userPrefs.priceRange;
      if (apartment.price >= minBudget && apartment.price <= maxBudget) {
        matchScore += 15;
        matchReasons.push('Within your budget');
      }
    }

    // Style and vibe matching
    const vibeTerms = apartment.vibe.toLowerCase().split(' ');
    const vibeMatches = searchTerms.filter(term => vibeTerms.includes(term));
    if (vibeMatches.length > 0) {
      matchScore += 10;
      matchReasons.push(`Matches ${apartment.vibe} vibe`);
    }

    return {
      apartment,
      matchScore,
      matchReasons
    };
  };

  const searchApartments = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const results = sampleProperties
      .map(apt => analyzePropertyMatch(apt, query, userPreferences))
      .filter(result => result.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return results;
  };

  const generateSuggestions = (query: string): string[] => {
    const suggestions = [
      "Show me apartments with a balcony",
      "Find modern studio spaces",
      "Properties good for remote work",
      "Places with city views",
      "Family-friendly apartments",
      "Luxury penthouses",
      "Pet-friendly properties",
      "Apartments with parking"
    ];

    // Filter suggestions based on query
    const queryLower = query.toLowerCase();
    return suggestions.filter(s => 
      !queryLower || !s.toLowerCase().includes(queryLower)
    ).slice(0, 4);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    const searchResults = searchApartments(inputValue);
    
    let agentContent = '';
    let apartments: Apartment[] = [];

    if (searchResults.length > 0) {
      agentContent = `🎯 I found ${searchResults.length} great matches for "${inputValue}"! Here's what I discovered:`;
      apartments = searchResults.map(r => r.apartment);
    } else {
      agentContent = `🤔 I couldn't find specific matches for "${inputValue}" in our current database. Let me suggest some alternatives that might interest you:`;
    }

    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: agentContent,
      apartments: apartments.length > 0 ? apartments : undefined,
      suggestions: generateSuggestions(inputValue)
    };

    setMessages(prev => [...prev, userMessage, agentMessage]);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
  };

  const handleModalLike = (apartment: Apartment) => {
    if (onMatch) {
      onMatch(apartment);
    }
    setSelectedApartment(null);
  };

  const handleModalDislike = (apartment: Apartment) => {
    setSelectedApartment(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-[700px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Housing Assistant</h3>
                <p className="text-xs text-gray-500">Powered by intelligent property analysis</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-gray-50 border text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.apartments && (
                    <div className="mt-4 space-y-3">
                      {message.apartments.map((apartment) => {
                        const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;
                        return (
                          <Card 
                            key={apartment.id} 
                            className="p-3 bg-white shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleApartmentClick(apartment)}
                          >
                            <div className="flex space-x-3">
                              <img 
                                src={apartment.images[0]} 
                                alt={apartment.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 mb-1">{apartment.title}</h4>
                                <div className="flex items-center text-xs text-gray-600 mb-2">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {apartment.location}
                                </div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="text-xs">
                                    {formatPrice(apartment.price)}/mo
                                  </Badge>
                                  <div className="flex items-center space-x-2">
                                    {vibeScore && (
                                      <Badge className="text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {Math.round(vibeScore.overall)}% match
                                      </Badge>
                                    )}
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {apartment.highlights.slice(0, 3).map((highlight, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {message.suggestions && (
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-2 text-gray-600">💡 Try these searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-white/50 hover:bg-white border-gray-200"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Search className="w-3 h-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about apartments with specific features..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI analyzes property descriptions, images, and tags for better matches
            </p>
          </div>
        </Card>
      </div>

      <PropertyDetailModal
        apartment={selectedApartment}
        userPreferences={userPreferences}
        isOpen={!!selectedApartment}
        onClose={() => setSelectedApartment(null)}
        onLike={handleModalLike}
        onDislike={handleModalDislike}
      />
    </>
  );
};
