import React, { useState } from "react";
import {
  Video,
  Users,
  Hash,
  ArrowRight,
  AlertCircle,
  X,
  Heart,
} from "lucide-react";

interface LoginScreenProps {
  onJoinRoom: (username: string, roomId: string) => void;
  errorMessage?: string;
  onClearError?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onJoinRoom,
  errorMessage,
  onClearError,
}) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-rose-500/30 to-violet-600/30 backdrop-blur-lg rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-rose-400/30 shadow-lg shadow-rose-500/20">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-300 to-violet-300 bg-clip-text text-transparent mb-2">
            Rifa
          </h1>
          <p className="text-slate-300 text-lg">
            Connect hearts across any distance
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-900/40 backdrop-blur-lg border border-red-500/40 rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-red-900/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-200 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="text-red-400 hover:text-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Login Form */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl shadow-slate-900/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Room ID Input */}
            <div className="space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-violet-400" />
                Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                placeholder="Enter room code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !roomId.trim()}
              className="w-full bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
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
          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Create a new room or join an existing one</p>
            <p className="text-xs mt-1 text-rose-400/70">
              Make sure the server is running on port 3001
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 mb-2 border border-slate-700/50 shadow-lg shadow-slate-900/30">
              <Video className="w-6 h-6 text-rose-400 mx-auto" />
            </div>
            <p className="text-slate-300 text-sm">Video</p>
          </div>
          <div className="text-center">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 mb-2 border border-slate-700/50 shadow-lg shadow-slate-900/30">
              <Users className="w-6 h-6 text-violet-400 mx-auto" />
            </div>
            <p className="text-slate-300 text-sm">Audio</p>
          </div>
          <div className="text-center">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 mb-2 border border-slate-700/50 shadow-lg shadow-slate-900/30">
              <Heart className="w-6 h-6 text-rose-400 mx-auto" />
            </div>
            <p className="text-slate-300 text-sm">Chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};
