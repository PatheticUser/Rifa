import { SignalingService } from './signaling';

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signalingService: SignalingService;
  private onRemoteStream?: (stream: MediaStream) => void;
  private onMessage?: (message: string) => void;
  private onConnectionStateChange?: (state: string) => void;
  private roomId: string = '';
  private username: string = '';
  private isInitiator: boolean = false;
  private remoteSocketId: string = '';

  private configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.voiparound.com' },
      { urls: 'stun:stun.voipbuster.com' },
      { urls: 'stun:stun.voipstunt.com' },
      { urls: 'stun:stun.voxgratia.org' }
    ]
  };

  constructor() {
    this.signalingService = new SignalingService();
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        this.signalingService.send({
          type: 'ice-candidate',
          candidate: event.candidate,
          targetSocketId: this.remoteSocketId
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      if (this.onRemoteStream && event.streams[0]) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateChange && this.peerConnection) {
        console.log('Connection state:', this.peerConnection.connectionState);
        this.onConnectionStateChange(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      console.log('Received data channel');
      this.setupDataChannel(event.channel);
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('ICE connection state:', this.peerConnection.iceConnectionState);
      }
    };
  }

async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }) {
  console.log('Checking mediaDevices support...');
  console.log('navigator:', navigator);
  console.log('navigator.mediaDevices:', navigator.mediaDevices);
  console.log('navigator.mediaDevices.getUserMedia:', navigator.mediaDevices?.getUserMedia);

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia not supported or not available due to insecure context.');
    throw new Error('getUserMedia not supported in this browser or due to insecure context.');
  }

  try {
    console.log('Requesting camera/microphone with constraints:', constraints);
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Local media stream obtained:', this.localStream);

    if (this.peerConnection && this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log('Adding track:', track.kind);
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    return this.localStream;
  } catch (error) {
    console.error('Error accessing media:', error);
    throw error;
  }
}


  startSignaling(roomId: string, username: string, onError?: (error: string) => void) {
    this.roomId = roomId;
    this.username = username;
    
    console.log(`Starting signaling for room ${roomId} as ${username}`);
    
    this.signalingService.connect(roomId, username, {
      onMessage: (message) => this.handleSignalingMessage(message),
      onUserJoined: (data) => this.handleUserJoined(data),
      onUserLeft: (data) => this.handleUserLeft(data),
      onError: onError
    });
  }

  private handleUserJoined(data: any) {
    console.log('User joined event:', data);
    
    if (data.isInitiator !== undefined) {
      this.isInitiator = data.isInitiator;
      console.log('Set as initiator:', this.isInitiator);
      
      if (this.isInitiator) {
        // Wait a bit for the other peer to be ready
        setTimeout(() => {
          console.log('Creating offer as initiator...');
          this.createOffer();
        }, 1000);
      }
    }
    
    if (data.socketId && data.socketId !== this.signalingService) {
      this.remoteSocketId = data.socketId;
    }
  }

  private handleUserLeft(data: any) {
    console.log('User left:', data);
    // Reset connection state
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange('disconnected');
    }
  }

  private async handleSignalingMessage(message: any) {
    try {
      if (message.type === 'chat') {
        if (this.onMessage) {
          this.onMessage(JSON.stringify(message.data));
        }
        return;
      }

      const { signal, fromSocketId } = message;
      this.remoteSocketId = fromSocketId;

      switch (signal.type) {
        case 'offer':
          console.log('Received offer');
          await this.handleOffer(signal.offer);
          break;
        case 'answer':
          console.log('Received answer');
          await this.handleAnswer(signal.answer);
          break;
        case 'ice-candidate':
          console.log('Received ICE candidate');
          await this.handleIceCandidate(signal.candidate);
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  }

  async createOffer() {
    if (!this.peerConnection) return;

    try {
      // Create data channel
      this.dataChannel = this.peerConnection.createDataChannel('messages', {
        ordered: true
      });
      this.setupDataChannel(this.dataChannel);

      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      
      this.signalingService.send({
        type: 'offer',
        offer: offer,
        targetSocketId: this.remoteSocketId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(offer);
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      this.signalingService.send({
        type: 'answer',
        answer: answer,
        targetSocketId: this.remoteSocketId
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;
    
    channel.onopen = () => {
      console.log('Data channel opened');
    };
    
    channel.onmessage = (event) => {
      if (this.onMessage) {
        this.onMessage(event.data);
      }
    };
    
    channel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  sendMessage(message: string) {
    // Send via signaling server for reliability
    this.signalingService.send({
      type: 'chat',
      text: message
    });
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  setCallbacks(callbacks: {
    onRemoteStream?: (stream: MediaStream) => void;
    onMessage?: (message: string) => void;
    onConnectionStateChange?: (state: string) => void;
  }) {
    this.onRemoteStream = callbacks.onRemoteStream;
    this.onMessage = callbacks.onMessage;
    this.onConnectionStateChange = callbacks.onConnectionStateChange;
  }

  disconnect() {
    console.log('Disconnecting...');
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    this.signalingService.disconnect();
  }

  isSignalingConnected(): boolean {
    return this.signalingService.isConnected();
  }
}