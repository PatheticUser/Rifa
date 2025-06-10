import React, { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { VideoChat } from './components/VideoChat';
import { ChatPanel } from './components/ChatPanel';
import { WebRTCManager } from './utils/webrtc';
import { Message, WebRTCState } from './types/webrtc';

interface AppState {
  isLoggedIn: boolean;
  username: string;
  roomId: string;
  isChatVisible: boolean;
  messages: Message[];
  errorMessage: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    isLoggedIn: false,
    username: '',
    roomId: '',
    isChatVisible: false,
    messages: [],
    errorMessage: ''
  });

  const [webrtcState, setWebRTCState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    dataChannel: null,
    isConnected: false,
    isAudioEnabled: true,
    isVideoEnabled: true
  });

  const [webrtcManager, setWebRTCManager] = useState<WebRTCManager | null>(null);

  const addMessage = useCallback((username: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      text,
      timestamp: new Date()
    };
    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  const handleJoinRoom = async (username: string, roomId: string) => {
    try {
      setAppState(prev => ({ ...prev, errorMessage: '' }));

      const manager = new WebRTCManager();
      setWebRTCManager(manager);

      // Set up callbacks
      manager.setCallbacks({
        onRemoteStream: (stream) => {
          console.log('Remote stream received');
          setWebRTCState(prev => ({ ...prev, remoteStream: stream, isConnected: true }));
        },
        onMessage: (message) => {
          try {
            const data = JSON.parse(message);
            addMessage(data.username, data.text);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        },
        onConnectionStateChange: (state) => {
          console.log('Connection state changed:', state);
          setWebRTCState(prev => ({ 
            ...prev, 
            isConnected: state === 'connected' 
          }));
        }
      });

      // Get user media first
      const localStream = await manager.getUserMedia();
      setWebRTCState(prev => ({ ...prev, localStream }));

      // Start signaling with error handling
      manager.startSignaling(roomId, username, (error: string) => {
        setAppState(prev => ({ ...prev, errorMessage: error }));
      });

      setAppState(prev => ({
        ...prev,
        isLoggedIn: true,
        username,
        roomId
      }));

    } catch (error) {
      console.error('Error joining room:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.name === 'NotAllowedError') {
          errorMessage = 'Camera and microphone access is required. Please allow permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera or microphone found. Please check your devices and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera or microphone is already in use. Please close other applications and try again.';
        }
      }
      
      setAppState(prev => ({ ...prev, errorMessage }));
    }
  };

  const handleToggleAudio = () => {
    if (webrtcManager) {
      const enabled = webrtcManager.toggleAudio();
      setWebRTCState(prev => ({ ...prev, isAudioEnabled: enabled }));
    }
  };

  const handleToggleVideo = () => {
    if (webrtcManager) {
      const enabled = webrtcManager.toggleVideo();
      setWebRTCState(prev => ({ ...prev, isVideoEnabled: enabled }));
    }
  };

  const handleToggleChat = () => {
    setAppState(prev => ({ ...prev, isChatVisible: !prev.isChatVisible }));
  };

  const handleSendMessage = (text: string) => {
    if (webrtcManager) {
      webrtcManager.sendMessage(text);
      // Don't add message here - it will come back through the signaling server
    }
  };

  const handleEndCall = () => {
    if (webrtcManager) {
      webrtcManager.disconnect();
    }
    
    // Reset state
    setAppState({
      isLoggedIn: false,
      username: '',
      roomId: '',
      isChatVisible: false,
      messages: [],
      errorMessage: ''
    });
    
    setWebRTCState({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      dataChannel: null,
      isConnected: false,
      isAudioEnabled: true,
      isVideoEnabled: true
    });
    
    setWebRTCManager(null);
  };

  const handleClearError = () => {
    setAppState(prev => ({ ...prev, errorMessage: '' }));
  };

  // Check signaling connection status
  const isSignalingConnected = webrtcManager?.isSignalingConnected() || false;

  if (!appState.isLoggedIn) {
    return (
      <LoginScreen 
        onJoinRoom={handleJoinRoom} 
        errorMessage={appState.errorMessage}
        onClearError={handleClearError}
      />
    );
  }

  return (
    <div className="relative">
      <VideoChat
        localStream={webrtcState.localStream}
        remoteStream={webrtcState.remoteStream}
        isAudioEnabled={webrtcState.isAudioEnabled}
        isVideoEnabled={webrtcState.isVideoEnabled}
        isConnected={webrtcState.isConnected}
        isSignalingConnected={isSignalingConnected}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleChat={handleToggleChat}
        onEndCall={handleEndCall}
        roomId={appState.roomId}
        username={appState.username}
      />
      
      <ChatPanel
        messages={appState.messages}
        onSendMessage={handleSendMessage}
        onClose={() => setAppState(prev => ({ ...prev, isChatVisible: false }))}
        username={appState.username}
        isVisible={appState.isChatVisible}
      />
    </div>
  );
}

export default App;