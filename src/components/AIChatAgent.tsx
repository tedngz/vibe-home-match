
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'renter' | 'realtor';
  userPreferences?: any;
  propertyImages?: string[];
}

export const AIChatAgent = ({ 
  isOpen, 
  onClose, 
  userType, 
  userPreferences,
  propertyImages 
}: AIChatAgentProps) => {
  const [message, setMessage] = useState('');
  const { 
    conversations, 
    messages, 
    currentConversationId, 
    setCurrentConversationId,
    createConversation, 
    sendMessage, 
    isSendingMessage 
  } = useChat();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      await createConversation('New Chat');
      // Wait for the conversation to be created
      const latestConversation = conversations[0];
      if (latestConversation) {
        conversationId = latestConversation.id;
        setCurrentConversationId(conversationId);
      }
    }

    if (conversationId) {
      sendMessage({
        message,
        conversationId,
        userType,
        userPreferences,
        propertyImages
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white/95 backdrop-blur-md flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">
              Hausto AI {userType === 'realtor' ? '- Property Assistant' : '- Home Finder'}
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">
                  {userType === 'realtor' 
                    ? 'Property Listing Assistant' 
                    : 'Your Personal Home Finder'
                  }
                </h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  {userType === 'realtor'
                    ? 'Upload property images and I\'ll help you create compelling titles and descriptions that highlight unique features.'
                    : 'Tell me what you\'re looking for in a home, and I\'ll help you find the perfect match from available properties.'
                  }
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.role === 'assistant' && (
                        <Bot className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                      )}
                      {msg.role === 'user' && (
                        <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-orange-500" />
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                userType === 'realtor'
                  ? 'Describe your property or ask for help with listings...'
                  : 'What kind of home are you looking for?'
              }
              disabled={isSendingMessage}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingMessage}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
