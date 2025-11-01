import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { SocketMessage } from '@/types/socket';

export function usePodMessages(podId: string | null) {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !podId) return;

    // Fetch existing messages
    fetch(`/api/pods/messages?podId=${podId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
      });

    // Listen for new messages
    socket.on('new-message', (message: SocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket, podId]);

  const sendMessage = (messageText: string, userId: string, username: string, avatarUrl: string | null) => {
    if (!socket || !podId) return;

    fetch('/api/pods/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ podId, messageText, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit('send-message', {
          podId,
          message: data.message,
          userId,
          username,
          avatarUrl,
        });
      });
  };

  return { messages, sendMessage };
}
