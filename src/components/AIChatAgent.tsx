
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MapPin, DollarSign, Home } from 'lucide-react';
import { Apartment } from '@/pages/Index';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  apartments?: Apartment[];
}

// Mock apartments database with additional features
const APARTMENT_DATABASE: (Apartment & { features: string[] })[] = [
  {
    id: '1',
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400'],
    title: 'Cozy Modern Loft with Smart TV',
    location: 'Brooklyn Heights',
    price: 2800,
    size: '1br',
    vibe: 'Urban Sanctuary',
    description: 'Modern loft with 65" Smart TV, high-speed internet, and entertainment center.',
    highlights: ['65" Smart TV', 'Netflix ready', 'Gaming setup', '12ft ceilings'],
    features: ['TV', 'smart TV', 'entertainment', 'gaming', 'netflix', 'streaming'],
    realtor: {
      id: 'realtor-1',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@homevibes.com'
    }
  },
  {
    id: '2',
    images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400'],
    title: 'Tech-Forward Studio',
    location: 'Manhattan',
    price: 2400,
    size: 'studio',
    vibe: 'Digital Nomad',
    description: 'Studio apartment with built-in desk, multiple monitors, and smart home features.',
    highlights: ['Home office setup', '75" OLED TV', 'Smart home', 'High-speed fiber'],
    features: ['TV', 'OLED', 'home office', 'desk', 'work from home', 'smart home'],
    realtor: {
      id: 'realtor-2',
      name: 'Michael Chen',
      phone: '(555) 987-6543',
      email: 'michael@urbanspaces.com'
    }
  },
  {
    id: '3',
    images: ['https://images.unsplash.com/photo-1483058712412-e9573fc25ebb?w=400'],
    title: 'Entertainment Paradise',
    location: 'Williamsburg',
    price: 3500,
    size: '2br',
    vibe: 'Entertainment Hub',
    description: 'Perfect for movie nights with 85" TV, surround sound, and media room.',
    highlights: ['85" TV', 'Surround sound', 'Media room', 'Gaming lounge'],
    features: ['TV', 'large screen', 'surround sound', 'media room', 'entertainment', 'gaming'],
    realtor: {
      id: 'realtor-3',
      name: 'Emma Rodriguez',
      phone: '(555) 456-7890',
      email: 'emma@creativeliving.com'
    }
  },
  {
    id: '4',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
    title: 'Smart Living Space',
    location: 'Queens',
    price: 2200,
    size: '1br',
    vibe: 'Tech Sanctuary',
    description: 'Smart TV integrated with home automation, voice control, and streaming setup.',
    highlights: ['55" Smart TV', 'Voice control', 'Home automation', 'Streaming ready'],
    features: ['TV', 'smart TV', 'voice control', 'automation', 'alexa', 'google home'],
    realtor: {
      id: 'realtor-4',
      name: 'David Park',
      phone: '(555) 321-9876',
      email: 'david@smartliving.com'
    }
  },
  {
    id: '5',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    title: 'Luxury Penthouse with Cinema',
    location: 'Upper East Side',
    price: 5800,
    size: '3br',
    vibe: 'Luxury Lifestyle',
    description: 'Penthouse with dedicated home theater, 100" projector, and premium sound system.',
    highlights: ['100" Projector', 'Home theater', 'Premium sound', 'Luxury finishes'],
    features: ['TV', 'projector', 'home theater', 'cinema', 'luxury', 'premium'],
    realtor: {
      id: 'realtor-5',
      name: 'Lisa Wong',
      phone: '(555) 654-3210',
      email: 'lisa@luxuryliving.com'
    }
  }
];

export const AIChatAgent = ({ isOpen, onClose }: AIChatAgentProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'agent',
      content: "Hi! I'm your AI housing assistant. I can help you find apartments with specific features. Try asking me something like 'Show me apartments with a TV' or 'Find places with a home office setup'."
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const searchApartments = (query: string): Apartment[] => {
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    return APARTMENT_DATABASE
      .filter(apt => 
        searchTerms.some(term => 
          apt.features.some(feature => feature.includes(term)) ||
          apt.title.toLowerCase().includes(term) ||
          apt.description.toLowerCase().includes(term) ||
          apt.highlights.some(highlight => highlight.toLowerCase().includes(term))
        )
      )
      .slice(0, 5)
      .map(({ features, ...apt }) => apt);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    const searchResults = searchApartments(inputValue);
    
    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: searchResults.length > 0 
        ? `I found ${searchResults.length} apartments matching your criteria:` 
        : "I couldn't find any apartments matching those specific features. Try searching for 'TV', 'home office', 'smart home', or other amenities.",
      apartments: searchResults.length > 0 ? searchResults : undefined
    };

    setMessages(prev => [...prev, userMessage, agentMessage]);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold">AI Housing Assistant</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                
                {message.apartments && (
                  <div className="mt-3 space-y-3">
                    {message.apartments.map((apartment) => (
                      <Card key={apartment.id} className="p-3 bg-white">
                        <div className="flex space-x-3">
                          <img 
                            src={apartment.images[0]} 
                            alt={apartment.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{apartment.title}</h4>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {apartment.location}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-xs">
                                ${apartment.price}/mo
                              </Badge>
                              <Badge className="text-xs bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800">
                                {apartment.vibe}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {apartment.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about apartments with specific features..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
