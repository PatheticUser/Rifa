import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff, Heart, Wifi, WifiOff } from 'lucide-react';

interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isConnected: boolean;
  isSignalingConnected: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
  roomId: string;
  username: string;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  localStream,
  remoteStream,
  isAudioEnabled,
  isVideoEnabled,
  isConnected,
  isSignalingConnected,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onEndCall,
  roomId,
  username
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const getConnectionStatus = () => {
    if (!isSignalingConnected) {
      return { text: 'Server Disconnected', color: 'bg-red-500/20 text-red-300 border-red-400/30', icon: WifiOff };
    }
    if (isConnected) {
      return { text: 'Connected', color: 'bg-green-500/20 text-green-300 border-green-400/30', icon: Wifi };
    }
    return { text: 'Connecting...', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30', icon: Wifi };
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/20 via-purple-900/30 to-pink-900/20 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              <div>
                <h2 className="text-white font-semibold">Room {roomId}</h2>
                <p className="text-white/60 text-sm">{username}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.text}
            </span>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative p-4">
        {/* Remote Video (Main) */}
        <div className="w-full h-full bg-black/20 rounded-2xl overflow-hidden relative backdrop-blur-sm border border-white/10">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-lg border border-white/20">
                  <Heart className="w-12 h-12 text-pink-300 animate-pulse" />
                </div>
                <p className="text-white/80 text-xl font-medium mb-2">Waiting for your connection...</p>
                <p className="text-white/60">Share room code: <span className="font-mono text-pink-300 bg-white/10 px-2 py-1 rounded">{roomId}</span></p>
                {!isSignalingConnected && (
                  <p className="text-red-300 text-sm mt-2">⚠️ Server connection lost. Please refresh the page.</p>
                )}
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black/30 rounded-xl overflow-hidden border border-white/20 backdrop-blur-sm">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="w-8 h-8 text-white/60" />
              </div>
            )}
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                <VideoOff className="w-8 h-8 text-white/60" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              <span className="text-white text-xs">You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/30 backdrop-blur-xl border-t border-white/10 p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
              isAudioEnabled
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : 'bg-red-500/80 hover:bg-red-600/80 text-white border-red-400/50'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
              isVideoEnabled
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : 'bg-red-500/80 hover:bg-red-600/80 text-white border-red-400/50'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={onToggleChat}
            className="w-12 h-12 rounded-full bg-pink-600/80 hover:bg-pink-700/80 text-white flex items-center justify-center transition-all border border-pink-500/50"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="w-12 h-12 rounded-full bg-red-500/80 hover:bg-red-600/80 text-white flex items-center justify-center transition-all border border-red-400/50"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};