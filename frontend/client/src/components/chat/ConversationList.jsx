import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, User } from 'lucide-react';
import { chatService } from '../../services/chatService';

const ConversationList = ({ onSelectConversation, selectedConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatService.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-muted-foreground">Loading conversations...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground p-4 pb-2">User Conversations</h3>
      {conversations.map((conversation) => (
        <Button
          key={conversation.partnerId}
          variant={selectedConversation?.partnerId === conversation.partnerId ? "default" : "ghost"}
          className="w-full justify-start p-4 h-auto"
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {conversation.partnerName}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {conversation.partnerEmail}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {conversation.lastMessage}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.lastMessageTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ConversationList;