"use client";
import React, { useRef, useState, useEffect } from "react";
import { Paperclip, Send, Loader2, X, Mic, Trash2, Square, Play, Pause } from "lucide-react";

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (val: string) => void;
  onSendMessage: () => void;
  sending: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const VoicePreviewPlayer = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef<string>("");

  useEffect(() => {
    audioUrl.current = URL.createObjectURL(file);
    const audio = new Audio(audioUrl.current);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      URL.revokeObjectURL(audioUrl.current);
    };
  }, [file]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error(err));
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 bg-[#1F2937] px-4 py-3 rounded-2xl w-fit min-w-[280px] ml-12 mb-3 border border-blue-500/30 shadow-lg">
      <button 
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
      </button>
      
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-semibold text-blue-400">Voice Message Preview</span>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-blue-500 transition-all duration-100" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 select-none min-w-[55px] text-right font-mono">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <button 
        onClick={onRemove}
        className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors shrink-0"
        title="Discard recording"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const ChatInput = ({ 
  messageInput, 
  setMessageInput, 
  onSendMessage, 
  sending,
  selectedFile,
  setSelectedFile
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: "audio/webm" });
        setSelectedFile(file);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Microphone access is required to record voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
      {selectedFile && selectedFile.type.startsWith("audio/") ? (
        <VoicePreviewPlayer file={selectedFile} onRemove={removeFile} />
      ) : (
        selectedFile && (
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
        )
      )}
      
      <div className="relative flex items-center gap-3">
        {isRecording ? (
          <div className="flex-1 relative bg-[#1F2937] border border-red-500/30 rounded-2xl py-4 px-4 flex items-center justify-between text-sm text-white shadow-inner">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-gray-200 font-medium ml-1">Recording Voice...</span>
              <span className="text-red-400 font-semibold font-mono">{formatTime(recordingTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={cancelRecording}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Cancel recording"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={stopRecording}
                className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-500 transition-colors"
                title="Stop recording"
              >
                <Square size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,audio/*"
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
            {messageInput.trim() || selectedFile ? (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                onClick={onSendMessage}
                disabled={sending}
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            ) : (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-600/30 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all shadow-md disabled:opacity-50"
                onClick={startRecording}
                disabled={sending}
                title="Record voice message"
              >
                <Mic size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
