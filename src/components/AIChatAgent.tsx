import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, MessageCircle, Bot, MapPin } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences?: any;
  userType: 'renter' | 'realtor';
  propertyImages?: string[];
}

export const AIChatAgent = ({ 
  isOpen, 
  onClose, 
  userPreferences, 
  userType,
  propertyImages = [] 
}: AIChatAgentProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'messages'>('ai');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  const {
    conversations,
    messages,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    sendMessage,
    isSendingMessage,
  } = useChat();

  const {
    sendMessage: sendDirectMessage,
    isSendingMessage: isSendingDirectMessage,
    messages: directMessages,
  } = useDirectMessages();

  const { realtorMatches, renterMatches } = useMatches();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !currentConversationId && activeTab === 'ai') {
      createConversation.mutate();
    }
  }, [isOpen, currentConversationId, activeTab]);

  useEffect(() => {
    if (currentConversationId && pendingMessage && activeTab === 'ai') {
      sendMessage.mutate({
        message: pendingMessage,
        conversationId: currentConversationId,
        userType,
        userPreferences,
        propertyImages,
      });
      setPendingMessage('');
    }
  }, [currentConversationId, pendingMessage, activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, directMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (activeTab === 'ai') {
      if (currentConversationId) {
        sendMessage.mutate({
          message: inputMessage.trim(),
          conversationId: currentConversationId,
          userType,
          userPreferences,
          propertyImages,
        });
      } else {
        setPendingMessage(inputMessage.trim());
        createConversation.mutate();
      }
    } else if (activeTab === 'messages' && selectedMatch) {
      const matches = userType === 'renter' ? renterMatches : realtorMatches;
      const match = matches.find(m => m.id === selectedMatch);
      if (match) {
        const receiverId = user?.id === match.realtor_id ? match.renter_id : match.realtor_id;
        sendDirectMessage.mutate({
          matchId: selectedMatch,
          content: inputMessage.trim(),
          receiverId,
        });
      }
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
  };

  const getTitle = () => 'Hausto Chat - AI Assistant & Messages';

  const getPlaceholder = () => {
    if (activeTab === 'ai') {
      return userType === 'realtor' 
        ? 'Ask me to help create property descriptions, titles, or marketing content...'
        : 'Ask me about rental properties...';
    }
    return 'Type your message...';
  };

  const getWelcomeMessage = () => {
    if (userType === 'realtor') {
      return "Hi! I'm Hausto AI, your property marketing assistant.";
    }
    return "Hi! I'm Hausto AI, your rental property assistant.";
  };

  const matches = userType === 'renter' ? renterMatches : realtorMatches;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl h-[85vh] max-h-[85vh] p-0 flex flex-col bg-white overflow-hidden">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mx-2 md:mx-4 mb-0 flex-shrink-0">
            <TabsTrigger value="ai" className="text-xs md:text-sm">AI Assistant</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs md:text-sm">Direct Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="flex-1 flex flex-col m-0 overflow-hidden">
            <ScrollArea className="flex-1 p-2 md:p-4 overflow-y-auto" ref={messagesEndRef}>
              <div className="space-y-3 md:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-4 md:py-8">
                    <MessageCircle className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-2 md:mb-4 opacity-50" />
                    <p className="text-base md:text-lg font-medium mb-1 md:mb-2">{getWelcomeMessage()}</p>
                    <p className="text-xs md:text-sm">Ask me anything about properties, neighborhoods, or your search preferences!</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg break-words ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-xs md:text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-3 md:px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-3 md:w-4 h-3 md:h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                        <span className="text-xs md:text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-2 md:p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  onKeyPress={handleKeyPress}
                  disabled={isSendingMessage}
                  className="flex-1 text-sm md:text-base"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSendingMessage}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 flex-shrink-0"
                  size="sm"
                >
                  <Send className="w-3 md:w-4 h-3 md:h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="flex-1 flex flex-col m-0 overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
              <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-2 md:p-4 border-b border-gray-200 flex-shrink-0">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">Your Matches</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </p>
                </div>
                
                <ScrollArea className="flex-1 overflow-y-auto">
                  {matches.length === 0 ? (
                    <div className="p-2 md:p-4 text-center text-gray-500">
                      <MessageCircle className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs md:text-sm">No matches yet</p>
                      <p className="text-xs text-gray-400 mt-1">Like properties to start conversations</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-1 md:p-2">
                      {matches.map((match) => (
                        <div
                          key={match.id}
                          onClick={() => handleMatchSelect(match.id)}
                          className={`p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg ${
                            selectedMatch === match.id ? 'bg-orange-50 border border-orange-200' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-2 md:space-x-3">
                            <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs md:text-sm">
                              {match.properties?.title.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs md:text-sm text-gray-900 truncate">
                                {match.properties?.title}
                              </p>
                              <div className="flex items-center mt-1">
                                <MapPin className="w-2 md:w-3 h-2 md:h-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 truncate">{match.properties?.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 md:mt-2 flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {formatPrice(match.properties?.price || 0)}/mo
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(match.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                {selectedMatch ? (
                  <>
                    <div className="p-2 md:p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                          R
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">Property Owner</h4>
                          <p className="text-xs md:text-sm text-gray-600 truncate">
                            {matches.find(m => m.id === selectedMatch)?.properties?.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-2 md:p-4 overflow-y-auto">
                      {directMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <MessageCircle className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-2 md:mb-4 opacity-50" />
                            <p className="text-sm md:text-base">Start the conversation!</p>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">Send a message to connect</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 md:space-y-4">
                          {directMessages.map((message) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg break-words ${
                                    isOwnMessage
                                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-xs md:text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                  }`}>
                                    {new Date(message.created_at).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="p-2 md:p-4 border-t border-gray-200 flex-shrink-0">
                      <div className="flex space-x-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={handleKeyPress}
                          disabled={isSendingDirectMessage}
                          className="flex-1 text-sm md:text-base"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isSendingDirectMessage}
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 flex-shrink-0"
                          size="sm"
                        >
                          <Send className="w-3 md:w-4 h-3 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-2 md:mb-4 opacity-50" />
                      <p className="text-sm md:text-base">Select a match to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};