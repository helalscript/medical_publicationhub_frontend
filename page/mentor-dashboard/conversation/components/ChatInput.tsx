"use client";
import React, { useRef } from "react";
import { Paperclip, Send, Loader2, X } from "lucide-react";

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (val: string) => void;
  onSendMessage: () => void;
  sending: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const ChatInput = ({ 
  messageInput, 
  setMessageInput, 
  onSendMessage, 
  sending,
  selectedFile,
  setSelectedFile
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {selectedFile && (
        <div className="flex items-center gap-2 bg-[#1F2937] px-3 py-2 rounded-lg w-fit ml-12 mb-2 border border-blue-500/30">
          <Paperclip size={14} className="text-blue-400" />
          <span className="text-xs text-gray-200 truncate max-w-[200px]">{selectedFile.name}</span>
          <button 
            onClick={removeFile}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors ${selectedFile ? "text-blue-400" : ""}`}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
            disabled={sending}
            className="w-full bg-[#1F2937] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner disabled:opacity-50"
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            onClick={onSendMessage}
            disabled={sending || (!messageInput.trim() && !selectedFile)}
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
