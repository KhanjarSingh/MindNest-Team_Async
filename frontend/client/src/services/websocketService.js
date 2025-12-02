import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'https://mindnest-team-async.onrender.com', {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(receiverId, content) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', { receiverId, content });
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receiveMessage');
    }
  }
}

export const websocketService = new WebSocketService();