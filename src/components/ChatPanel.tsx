import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Heart } from 'lucide-react';
import { Message } from '../types/webrtc';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  username: string;
  isVisible: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onClose,
  username,
  isVisible
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col z-50">
      {/* Header */}
      <div className="bg-black/30 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="text-white font-semibold">Messages</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-pink-300" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.username === username
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  {message.username !== username && (
                    <p className="text-xs text-white/60 mb-1">{message.username}</p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};