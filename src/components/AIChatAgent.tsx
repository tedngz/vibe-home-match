
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, User, MessageCircle, Heart } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { useMatches } from '@/hooks/useMatches';
import { UserPreferences, Apartment } from '@/pages/Index';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences?: UserPreferences | null;
  userType?: 'renter' | 'realtor';
  propertyImages?: string[];
}

export const AIChatAgent = ({ 
  isOpen, 
  onClose, 
  userPreferences, 
  userType = 'renter',
  propertyImages 
}: AIChatAgentProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ai');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  const {
    conversations,
    messages,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    isCreatingConversation,
    sendMessage,
    isSendingMessage,
  } = useChat();

  const {
    conversations: directConversations,
    messages: directMessages,
    currentMatchId,
    setCurrentMatchId,
    sendMessage: sendDirectMessage,
    isSendingMessage: isSendingDirectMessage,
    loadingConversations,
    loadingMessages,
  } = useDirectMessages();

  const { renterMatches, realtorMatches } = useMatches();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !currentConversationId) {
      console.log('Creating new conversation, current conversations:', conversations.length);
      const title = userType === 'realtor' ? 'Property Marketing Assistant' : 'Property Search Chat';
      createConversation(title);
    } else if (isOpen && currentConversationId) {
      console.log('Using existing conversation:', currentConversationId);
    }
  }, [isOpen, currentConversationId, createConversation, userType]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (activeTab === 'ai') {
      // Handle AI chat
      console.log('Sending message to AI:', inputMessage);
      console.log('Current conversation ID:', currentConversationId);
      console.log('User type:', userType);

      // If no conversation exists, create one and wait for it
      if (!currentConversationId) {
        console.log('Creating conversation before sending message');
        const title = userType === 'realtor' ? 'Property Marketing Assistant' : 'Property Search Chat';
        
        try {
          await new Promise<void>((resolve) => {
            createConversation(title);
            // Wait a bit for the conversation to be created
            const checkConversation = () => {
              if (currentConversationId) {
                resolve();
              } else {
                setTimeout(checkConversation, 100);
              }
            };
            checkConversation();
          });
        } catch (error) {
          console.error('Failed to create conversation:', error);
          return;
        }
      }

      // Enhanced message with context for different user types
      const messageData = {
        message: inputMessage,
        conversationId: currentConversationId,
        userType,
        userPreferences: userType === 'renter' ? userPreferences : undefined,
        propertyImages: userType === 'realtor' ? propertyImages : undefined,
      };

      console.log('Sending message data:', messageData);
      sendMessage(messageData);
    } else {
      // Handle direct message to realtor/renter
      if (!selectedMatch || !currentMatchId) {
        console.error('No match selected for direct message');
        return;
      }

      const matches = userType === 'renter' ? renterMatches : realtorMatches;
      const match = matches.find(m => m.id === selectedMatch);
      if (!match) {
        console.error('Match not found');
        return;
      }

      const receiverId = userType === 'renter' ? match.realtor_id : match.renter_id;
      
      sendDirectMessage({
        matchId: selectedMatch,
        content: inputMessage,
        receiverId: receiverId
      });
    }
    
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    setCurrentMatchId(matchId);
  };

  const getTitle = () => {
    return 'Hausto Chat - AI Assistant & Messages';
  };

  const getPlaceholder = () => {
    if (activeTab === 'ai') {
      if (userType === 'realtor') {
        return 'Ask me to help create property descriptions, titles, or marketing content...';
      }
      return 'Ask me about rental properties...';
    } else {
      return 'Type your message...';
    }
  };

  const getWelcomeMessage = () => {
    if (userType === 'realtor') {
      return {
        title: "Hi! I'm Hausto AI, your property marketing assistant.",
        subtitle: "I can help you create compelling property descriptions, catchy titles, and marketing content that highlights your listings' best features!"
      };
    }
    return {
      title: "Hi! I'm Hausto AI, your rental property assistant.",
      subtitle: "Ask me about properties, neighborhoods, or anything rental-related!"
    };
  };

  const welcomeMessage = getWelcomeMessage();
  const matches = userType === 'renter' ? renterMatches : realtorMatches;
  const currentMessages = activeTab === 'ai' ? messages : directMessages;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages ({matches.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="flex-1 flex flex-col space-y-4">
              <ScrollArea className="flex-1 p-4 border rounded-lg">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                      <p>{welcomeMessage.title}</p>
                      <p className="text-sm mt-2">{welcomeMessage.subtitle}</p>
                      
                      {/* Add suggestion prompts for renters */}
                      {userType === 'renter' && (
                        <div className="mt-6 space-y-2">
                          <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {[
                              "Find apartments with big windows",
                              "Show me modern minimalist places",
                              "Properties with good natural light",
                              "Apartments near District 1",
                              "Cozy places under 15M VND",
                              "Pet-friendly apartments",
                              "Places with balcony views",
                              "Family-friendly neighborhoods"
                            ].map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setInputMessage(suggestion)}
                                className="px-3 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full border border-blue-200 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-orange-500 text-white ml-auto'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isSendingMessage && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="messages" className="flex-1 flex flex-col space-y-4">
              <div className="flex-1 flex">
                {/* Match list */}
                <div className="w-1/3 border-r pr-4">
                  <h3 className="font-semibold mb-3">Your Matches</h3>
                  <div className="space-y-2">
                    {matches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No matches yet</p>
                      </div>
                    ) : (
                      matches.map((match) => (
                        <div
                          key={match.id}
                          onClick={() => handleMatchSelect(match.id)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedMatch === match.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {userType === 'renter' ? 'Realtor' : 'Renter'}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {match.properties?.title || 'Property Match'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPrice(match.properties?.price || 0)}/mo
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="w-2/3 pl-4 flex flex-col">
                  {selectedMatch ? (
                    <>
                      <ScrollArea className="flex-1 p-4 border rounded-lg">
                        <div className="space-y-4">
                          {directMessages.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">No messages yet. Start the conversation!</p>
                            </div>
                          )}
                          
                          {directMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex items-start space-x-3 ${
                                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                  message.sender_id === user?.id
                                    ? 'bg-orange-500 text-white ml-auto'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Select a match to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={(activeTab === 'ai' && (isSendingMessage || !currentConversationId)) || (activeTab === 'messages' && (!selectedMatch || isSendingDirectMessage))}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || (activeTab === 'ai' && isSendingMessage) || (activeTab === 'messages' && (!selectedMatch || isSendingDirectMessage))}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
