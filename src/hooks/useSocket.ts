import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Detect if we're on mobile or have poor network
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Use window.location for Socket.io URL (same origin) in production
    const socketUrl = 
      process.env.NEXT_PUBLIC_SOCKET_URL || 
      (typeof window !== 'undefined' 
        ? `${window.location.protocol}//${window.location.hostname}:${process.env.NODE_ENV === 'production' ? window.location.port || '' : '3001'}`
        : 'http://localhost:3001');
    
    if (!socket || !socket.connected) {
      socket = io(socketUrl, {
        // Prefer polling on mobile, websocket on desktop
        transports: isMobile ? ['polling', 'websocket'] : ['websocket', 'polling'],
        // Enable reconnection with exponential backoff
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        // Timeout for connection attempts
        timeout: 20000,
        // Enable force new connection if needed
        forceNew: false,
      });

      socket.on('connect', () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('✅ Socket connected:', socket?.id);
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('❌ Socket disconnected:', reason);
        
        // Don't show error for intentional disconnects
        if (reason !== 'io client disconnect') {
          setConnectionError('Connection lost. Reconnecting...');
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionError('Failed to connect. Please check your internet connection.');
        
        // Auto-retry after delay
        setTimeout(() => {
          if (socket && !socket.connected) {
            socket.connect();
          }
        }, 3000);
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
        setConnectionError(null);
      });

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Reconnection attempt', attemptNumber);
        setConnectionError(`Reconnecting... (attempt ${attemptNumber})`);
      });

      socket.on('reconnect_failed', () => {
        console.error('❌ Socket reconnection failed');
        setConnectionError('Connection failed. Please refresh the page.');
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // Only disconnect on component unmount if socket is truly unused
    };
  }, []);

  return { socket, isConnected, connectionError };
}
