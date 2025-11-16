// Helper to emit socket events from API routes
// This connects to the socket.io server to broadcast messages

export async function emitToPod(podId: string, event: string, data: any) {
  try {
    const emitPort = process.env.SOCKET_EMIT_PORT || 3002;
    const socketHost = process.env.SOCKET_HOST || 'localhost';
    
    // Use the emit server endpoint
    const emitUrl = process.env.SOCKET_EMIT_URL || `http://${socketHost}:${emitPort}/emit`;
    
    const response = await fetch(emitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: podId,
        event,
        data,
      }),
    });
    
    if (!response.ok) {
      console.warn('Socket emit failed, message will appear on next poll');
    }
  } catch (error) {
    // Socket server might not be running or accessible
    // That's okay - the client will poll for new messages
    console.log('Socket emit not available, client will poll for new messages');
  }
}

