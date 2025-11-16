import { useEffect, useState, useRef } from 'react';
import { useSocket } from './useSocket';
import { SocketMessage } from '@/types/socket';

export function usePodMessages(podId: string | null) {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const { socket } = useSocket();
  const lastMessageIdRef = useRef<string | null>(null);
  const sendingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!podId) return;

    // Fetch existing messages
    const fetchMessages = () => {
      fetch(`/api/pods/messages?podId=${podId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
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

  const sendMessage = async (messageText: string, userId: string, username: string, avatarUrl: string | null, displayName?: string) => {
    if (!socket || !podId || sendingRef.current) return;

    try {
      sendingRef.current = true;
      
      const res = await fetch('/api/pods/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podId, messageText, userId }),
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

  return { messages, sendMessage, isAITyping };
}
