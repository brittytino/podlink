import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { SocketMessage } from '@/types/socket';

export function usePodMessages(podId: string | null) {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const { socket } = useSocket();

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
    if (!socket || !podId) return;

    try {
      const res = await fetch('/api/pods/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podId, messageText, userId }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.message) {
        socket.emit('send-message', {
          podId,
          message: data.message,
          userId,
          username,
          displayName, // Include displayName for anonymity
          avatarUrl,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { messages, sendMessage };
}
