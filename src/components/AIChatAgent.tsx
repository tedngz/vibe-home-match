
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { UserPreferences, Apartment } from '@/pages/Index';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !currentConversationId && conversations.length === 0) {
      const title = userType === 'realtor' ? 'Property Marketing Assistant' : 'Property Search Chat';
      createConversation(title);
    }
  }, [isOpen, currentConversationId, conversations.length, createConversation, userType]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentConversationId) return;

    // Enhanced message with context for different user types
    const messageData = {
      message: inputMessage,
      conversationId: currentConversationId,
      userType,
      userPreferences: userType === 'renter' ? userPreferences : undefined,
      propertyImages: userType === 'realtor' ? propertyImages : undefined,
    };

    sendMessage(messageData);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getTitle = () => {
    if (userType === 'realtor') {
      return 'Hausto AI - Property Marketing Assistant';
    }
    return 'Hausto AI - Property Assistant';
  };

  const getPlaceholder = () => {
    if (userType === 'realtor') {
      return 'Ask me to help create property descriptions, titles, or marketing content...';
    }
    return 'Ask me about rental properties...';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 p-4 border rounded-lg">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>{welcomeMessage.title}</p>
                  <p className="text-sm mt-2">{welcomeMessage.subtitle}</p>
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
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={isSendingMessage || !currentConversationId}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSendingMessage || !currentConversationId}
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
