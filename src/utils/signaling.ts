import { io, Socket } from 'socket.io-client';

export class SignalingService {
  private socket: Socket | null = null;
  private roomId: string = '';
  private username: string = '';
  private onMessage?: (message: any) => void;
  private onUserJoined?: (data: any) => void;
  private onUserLeft?: (data: any) => void;
  private onError?: (error: string) => void;

  constructor() {}

  connect(roomId: string, username: string, callbacks: {
    onMessage: (message: any) => void;
    onUserJoined?: (data: any) => void;
    onUserLeft?: (data: any) => void;
    onError?: (error: string) => void;
  }) {
    this.roomId = roomId;
    this.username = username;
    this.onMessage = callbacks.onMessage;
    this.onUserJoined = callbacks.onUserJoined;
    this.onUserLeft = callbacks.onUserLeft;
    this.onError = callbacks.onError;

    // Connect to our signaling server
    this.socket = io('https://192.168.1.105:3001', {
    transports: ['websocket'],
    timeout: 5000,
    forceNew: true,
    rejectUnauthorized: false
});


    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      
      // Join the room
      this.socket!.emit('join-room', {
        roomId: this.roomId,
        username: this.username
      });
    });

    this.socket.on('room-joined', (data) => {
      console.log('Successfully joined room:', data);
      if (this.onUserJoined) {
        this.onUserJoined(data);
      }
    });

    this.socket.on('user-joined', (data) => {
      console.log('User joined room:', data);
      if (this.onUserJoined) {
        this.onUserJoined(data);
      }
    });

    this.socket.on('user-left', (data) => {
      console.log('User left room:', data);
      if (this.onUserLeft) {
        this.onUserLeft(data);
      }
    });

    this.socket.on('webrtc-signal', (data) => {
      console.log('Received WebRTC signal:', data.signal.type);
      if (this.onMessage) {
        this.onMessage(data);
      }
    });

    this.socket.on('chat-message', (message) => {
      console.log('Received chat message:', message);
      if (this.onMessage) {
        this.onMessage({ type: 'chat', data: message });
      }
    });

    this.socket.on('error', (error) => {
      console.error('Signaling error:', error);
      if (this.onError) {
        this.onError(error.message || 'Connection error');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      if (this.onError) {
        this.onError('Failed to connect to server. Please check if the server is running.');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from signaling server:', reason);
    });
  }

  send(message: any) {
    if (this.socket && this.socket.connected) {
      if (message.type === 'chat') {
        this.socket.emit('chat-message', {
          roomId: this.roomId,
          message: message.text
        });
      } else {
        this.socket.emit('webrtc-signal', {
          roomId: this.roomId,
          signal: message,
          targetSocketId: message.targetSocketId
        });
      }
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('leave-room');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}