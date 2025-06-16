import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Heart } from "lucide-react";
import { Message } from "../types/webrtc";

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
  isVisible,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/60 p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="text-slate-100 font-semibold">Messages</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/60 hover:bg-slate-600/60 flex items-center justify-center transition-all border border-slate-600/50"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.username === username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg shadow-lg ${
                      message.username === username
                        ? "bg-gradient-to-r from-rose-600 to-violet-600 text-white shadow-rose-600/25"
                        : "bg-slate-700/60 text-slate-100 border border-slate-600/50 shadow-slate-900/50"
                    }`}
                  >
                    {message.username !== username && (
                      <p className="text-xs text-slate-400 mb-1">
                        {message.username}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
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
        <div className="p-4 border-t border-slate-700/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all shadow-lg shadow-rose-600/25"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 right-0 w-80 bg-slate-900/80 backdrop-blur-xl border-l border-slate-700/50 z-50 shadow-2xl shadow-slate-900/50">
        {/* Header */}
        <div className="bg-slate-800/60 p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="text-slate-100 font-semibold">Messages</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/60 hover:bg-slate-600/60 flex items-center justify-center transition-all border border-slate-600/50"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.username === username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg shadow-lg ${
                      message.username === username
                        ? "bg-gradient-to-r from-rose-600 to-violet-600 text-white shadow-rose-600/25"
                        : "bg-slate-700/60 text-slate-100 border border-slate-600/50 shadow-slate-900/50"
                    }`}
                  >
                    {message.username !== username && (
                      <p className="text-xs text-slate-400 mb-1">
                        {message.username}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all shadow-lg shadow-rose-600/25"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
