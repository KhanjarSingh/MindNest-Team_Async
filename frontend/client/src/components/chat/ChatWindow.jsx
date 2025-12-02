import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { websocketService } from '../../services/websocketService';

const ChatWindow = ({ receiverId, receiverName, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    
    // Connect websocket
    websocketService.connect(currentUserId);
    
    // Listen for new messages
    websocketService.onReceiveMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      websocketService.offReceiveMessage();
    };
  }, [receiverId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getChatHistory(receiverId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Send via websocket for real-time delivery
      websocketService.sendMessage(receiverId, messageContent);
      
      // Also send via API for persistence
      const response = await chatService.sendMessage(receiverId, messageContent);
      
      // Add message to local state if not already added by websocket
      setMessages(prev => {
        const exists = prev.some(msg => 
          msg.content === messageContent && 
          msg.senderId === currentUserId &&
          Math.abs(new Date(msg.createdAt) - new Date()) < 5000
        );
        if (!exists) {
          return [...prev, response.data];
        }
        return prev;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Re-add message to input on error
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">
          Chat with {receiverName || 'Admin'}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;