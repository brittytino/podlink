import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
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
