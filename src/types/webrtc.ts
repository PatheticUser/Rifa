export interface User {
  username: string;
}

export interface Room {
  id: string;
  users: User[];
  createdAt: Date;
}

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}