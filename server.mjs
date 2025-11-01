import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

// Enhanced CORS configuration for mobile devices
// Allow all origins in development, specific origins in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.NEXTAUTH_URL || 'https://your-app.vercel.app',
      process.env.NEXT_PUBLIC_SOCKET_URL || 'https://your-app.vercel.app',
    ].filter(Boolean)
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.0.0/16', // Allow local network for mobile testing
      'http://10.0.0.0/8',
      /^https?:\/\/.*\.vercel\.app$/, // Vercel preview URLs
    ];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin matches allowed origins
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin || origin.startsWith(allowedOrigin);
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        // In development, log but allow
        if (process.env.NODE_ENV !== 'production') {
          console.log(`⚠️  Allowing origin (dev): ${origin}`);
          callback(null, true);
        } else {
          console.log(`❌ Blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Enable polling for mobile devices with poor WebSocket support
  transports: ['websocket', 'polling'],
  // Connection timeout
  pingTimeout: 60000,
  pingInterval: 25000,
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-pod', ({ userId, podId, username }) => {
    socket.join(podId);
    onlineUsers.set(userId, { socketId: socket.id, podId, username });
    
    // Notify pod members
    io.to(podId).emit('user-online', { userId, username });
    console.log(`${username} joined pod ${podId}`);
  });

  socket.on('send-message', ({ podId, message, userId, username, avatarUrl }) => {
    io.to(podId).emit('new-message', {
      id: message.id,
      messageText: message.messageText,
      userId,
      username,
      avatarUrl,
      createdAt: message.createdAt,
      isCrisisResponse: message.isCrisisResponse,
    });
  });

  socket.on('crisis-alert', ({ podId, alert, username, userId }) => {
    io.to(podId).emit('crisis-alert-received', {
      alertId: alert.id,
      userId,
      username,
      message: alert.message,
      createdAt: alert.createdAt,
    });
  });

  socket.on('typing', ({ podId, username }) => {
    socket.to(podId).emit('user-typing', { username });
  });

  socket.on('stop-typing', ({ podId }) => {
    socket.to(podId).emit('user-stop-typing');
  });

  socket.on('alert-resolved', ({ podId, alertId }) => {
    io.to(podId).emit('alert-resolved', { alertId });
  });

  socket.on('disconnect', () => {
    const userEntry = Array.from(onlineUsers.entries()).find(
      ([, data]) => data.socketId === socket.id
    );

    if (userEntry) {
      const [userId, { podId, username }] = userEntry;
      onlineUsers.delete(userId);
      io.to(podId).emit('user-offline', { userId, username });
      console.log(`${username} disconnected`);
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.io server running on port ${PORT}`);
});
