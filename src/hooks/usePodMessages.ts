import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from './useSocket';
import { SocketMessage, MessageReaction } from '@/types/socket';

export function usePodMessages(podId: string | null) {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const { socket } = useSocket();
  const lastMessageIdRef = useRef<string | null>(null);
  const sendingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!podId) return;

    // Fetch existing messages with reactions
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/pods/messages?podId=${podId}`);
        const data = await res.json();
        
        if (data.messages) {
          // Fetch reactions for each message
          const messagesWithReactions = await Promise.all(
            data.messages.map(async (msg: SocketMessage) => {
              try {
                const reactionsRes = await fetch(`/api/pods/messages/reactions?messageId=${msg.id}`);
                const reactionsData = await reactionsRes.json();
                return {
                  ...msg,
                  reactions: reactionsData.reactions || [],
                };
              } catch {
                return msg;
              }
            })
          );
          
          setMessages(messagesWithReactions);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for new messages via socket
    if (socket) {
      socket.on('new-message', (message: SocketMessage) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      });
    }

    // Poll for new messages every 3 seconds as fallback (in case socket fails)
    const pollInterval = setInterval(fetchMessages, 3000);

    return () => {
      if (socket) {
        socket.off('new-message');
      }
      clearInterval(pollInterval);
    };
  }, [socket, podId]);

  const sendMessage = async (
    messageText: string, 
    userId: string, 
    username: string, 
    avatarUrl: string | null, 
    displayName?: string,
    imageUrl?: string | null
  ) => {
    if (!socket || !podId || sendingRef.current) return;

    try {
      sendingRef.current = true;
      
      const res = await fetch('/api/pods/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podId, messageText, userId, imageUrl }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.message) {
        // Avoid duplicate messages
        if (lastMessageIdRef.current !== data.message.id) {
          lastMessageIdRef.current = data.message.id;
          
          socket.emit('send-message', {
            podId,
            message: data.message,
            userId,
            username,
            displayName,
            avatarUrl,
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      sendingRef.current = false;
    }
  };

  const updateMessageReactions = useCallback((messageId: string, reactions: MessageReaction[]) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, reactions } : msg
      )
    );
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
  }, []);

  return { messages, sendMessage, isAITyping, updateMessageReactions, deleteMessage };
}
