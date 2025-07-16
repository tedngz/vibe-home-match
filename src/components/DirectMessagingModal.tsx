import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Send, User, MapPin, Trash2, MessageCircle } from 'lucide-react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DirectMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMatchId?: string;
}

export const DirectMessagingModal = ({ isOpen, onClose, initialMatchId }: DirectMessagingModalProps) => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    currentMatchId,
    setCurrentMatchId,
    sendMessage,
    isSendingMessage,
    deleteConversation,
    markAsRead,
    loadingConversations,
    loadingMessages,
  } = useDirectMessages();

  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (initialMatchId && isOpen) {
      setCurrentMatchId(initialMatchId);
    }
  }, [initialMatchId, isOpen, setCurrentMatchId]);

  useEffect(() => {
    if (currentMatchId && messages.length > 0) {
      markAsRead(currentMatchId);
    }
  }, [currentMatchId, messages.length, markAsRead]);

  const currentConversation = conversations.find(conv => conv.match_id === currentMatchId);
  const currentMatch = currentConversation?.property_matches;

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentMatchId || !currentMatch) return;

    const receiverId = user?.id === currentMatch.realtor_id 
      ? currentMatch.renter_id 
      : currentMatch.realtor_id;

    sendMessage({
      matchId: currentMatchId,
      content: messageText.trim(),
      receiverId
    });

    setMessageText('');
  };

  const handleDeleteConversation = () => {
    if (currentMatchId) {
      deleteConversation(currentMatchId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <Card className="w-full max-w-5xl h-[90vh] md:h-[80vh] bg-white flex flex-col md:flex-row overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-1/3 border-r md:border-r border-b md:border-b-0 flex flex-col max-h-[40vh] md:max-h-none">
          <div className="p-2 md:p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Messages</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            {loadingConversations ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Messages will appear here when you match with properties</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => {
                  const match = conversation.property_matches;
                  const property = match?.properties;
                  const isSelected = currentMatchId === conversation.match_id;
                  const isRealtor = user?.id === match?.realtor_id;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setCurrentMatchId(conversation.match_id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg ${
                        isSelected ? 'bg-orange-50 border border-orange-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {isRealtor ? 'Interested Renter' : 'Property Owner'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{property?.title}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500 truncate">{property?.location}</span>
                          </div>
                          {conversation.last_message_preview && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {conversation.last_message_preview}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {property?.price?.toLocaleString()} VND/mo
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(conversation.last_message_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation && currentMatch ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {user?.id === currentMatch.realtor_id ? 'Interested Renter' : 'Property Owner'}
                      </h4>
                      <button
                        onClick={() => {
                          // TODO: Open property detail modal
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                      >
                        {currentMatch.properties?.title}
                      </button>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this conversation? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConversation} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start the conversation!</p>
                      <p className="text-sm text-gray-400 mt-1">Send a message to connect</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      const isRealtor = user?.id === currentMatch?.realtor_id;
                      const senderName = isOwnMessage 
                        ? 'You' 
                        : (isRealtor ? 'Renter' : 'Property Owner');
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                            <p className="text-xs text-gray-500 mb-1 px-1">
                              {senderName}
                            </p>
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                    disabled={isSendingMessage}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSendingMessage}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};