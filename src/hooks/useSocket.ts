import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    if (!socket) {
      socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  return { socket, isConnected };
}
