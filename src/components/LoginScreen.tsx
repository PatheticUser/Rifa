import React, { useState } from 'react';
import { Video, Users, Hash, ArrowRight, AlertCircle, X, Heart } from 'lucide-react';

interface LoginScreenProps {
  onJoinRoom: (username: string, roomId: string) => void;
  errorMessage?: string;
  onClearError?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onJoinRoom, 
  errorMessage, 
  onClearError 
}) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return;

    setIsLoading(true);
    
    try {
      await onJoinRoom(username.trim(), roomId.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/30 via-purple-900/40 to-pink-900/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Heart className="w-10 h-10 text-pink-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Rifa</h1>
          <p className="text-white/70 text-lg">Connect hearts across any distance</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-100 text-sm leading-relaxed">{errorMessage}</p>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="text-red-300 hover:text-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-white font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Room ID Input */}
            <div className="space-y-2">
              <label className="text-white font-medium flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                placeholder="Enter room code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !roomId.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-6 text-center text-white/60 text-sm">
            <p>Create a new room or join an existing one</p>
            <p className="text-xs mt-1 text-pink-300/60">Make sure the server is running on port 3001</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-2 border border-white/20">
              <Video className="w-6 h-6 text-pink-300 mx-auto" />
            </div>
            <p className="text-white/70 text-sm">Video</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-2 border border-white/20">
              <Users className="w-6 h-6 text-pink-300 mx-auto" />
            </div>
            <p className="text-white/70 text-sm">Audio</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-2 border border-white/20">
              <Heart className="w-6 h-6 text-pink-300 mx-auto" />
            </div>
            <p className="text-white/70 text-sm">Chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};