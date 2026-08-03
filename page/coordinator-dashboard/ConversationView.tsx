"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare, Shield, BookOpen, GraduationCap, Loader2, Mic, Trash2, Square, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";

interface IChat {
  id: number;
  name: string;
  role: "mentor" | "researcher";
  avatarText: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
}

interface IMessage {
  id: number;
  sender: "coordinator" | "other";
  text: string;
  time: string;
  file?: string;
}

const INITIAL_CHATS: IChat[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "mentor",
    avatarText: "SJ",
    lastMessage: "I submitted the cardiovascular prediction model proposal. Let me know if you need adjustments.",
    time: "10:30 AM",
    unread: true
  },
  {
    id: 2,
    name: "Prof. David Vance",
    role: "mentor",
    avatarText: "DV",
    lastMessage: "Thank you for approving the microplastics study. I will send the schedule details soon.",
    time: "Yesterday"
  },
  {
    id: 3,
    name: "Alice Montgomery",
    role: "researcher",
    avatarText: "AM",
    lastMessage: "Can you confirm when the Quantum Dot opportunity enrollment will be approved?",
    time: "2 days ago",
    unread: true
  },
  {
    id: 4,
    name: "Robert Chen",
    role: "researcher",
    avatarText: "RC",
    lastMessage: "I have joined the microplastics sampling group. Glad to be on board!",
    time: "3 days ago"
  }
];

const INITIAL_MESSAGES: Record<number, IMessage[]> = {
  1: [
    { id: 1, sender: "other", text: "Hello Coordinator, I have drafted the cardiovascular disease prediction proposal.", time: "10:15 AM" },
    { id: 2, sender: "coordinator", text: "Hi Dr. Jenkins, thanks! I am reviewing the objectives and methodology now.", time: "10:20 AM" },
    { id: 3, sender: "other", text: "Great. I submitted the cardiovascular prediction model proposal. Let me know if you need adjustments.", time: "10:30 AM" }
  ],
  2: [
    { id: 1, sender: "other", text: "Hi, I have completed the submission details for the Microplastics study.", time: "Monday, 2:00 PM" },
    { id: 2, sender: "coordinator", text: "Hi Prof. Vance, I reviewed and approved it. You now have a 3-month deadline.", time: "Monday, 3:30 PM" },
    { id: 3, sender: "other", text: "Thank you for approving the microplastics study. I will send the schedule details soon.", time: "Monday, 3:45 PM" }
  ],
  3: [
    { id: 1, sender: "other", text: "Dear Coordinator, I submitted my application for Quantum Dot solar cells optimization under Dr. Alan Mercer.", time: "Tuesday, 9:00 AM" },
    { id: 2, sender: "other", text: "Can you confirm when the Quantum Dot opportunity enrollment will be approved?", time: "Tuesday, 4:15 PM" }
  ],
  4: [
    { id: 1, sender: "coordinator", text: "Welcome to the microplastics sampling program, Robert.", time: "Last week" },
    { id: 2, sender: "other", text: "I have joined the microplastics sampling group. Glad to be on board!", time: "Last week" }
  ]
};

const AudioMessagePlayer = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl min-w-[240px] max-w-xs border border-white/10 select-none">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-all shrink-0 shadow-md shadow-blue-500/20"
      >
        {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} className="ml-0.5" fill="currentColor" />}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleScrub}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
        />
        <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const VoicePreviewPlayer = ({ fileUrl, onRemove }: { fileUrl: string; onRemove: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(fileUrl);
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
    };
  }, [fileUrl]);

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
    <div className="flex items-center gap-3 bg-[#1F2937] px-4 py-3 rounded-2xl w-fit min-w-[280px] mb-3 border border-[#00D1FF]/30 shadow-lg">
      <button 
        type="button"
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
      </button>
      
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-semibold text-[#00D1FF]">Voice Message Preview</span>
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
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors shrink-0"
        title="Discard recording"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const ConversationView = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, IMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const [recordedFileUrl, setRecordedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load chats and messages from localStorage if exist
    if (typeof window !== "undefined") {
      const storedChats = localStorage.getItem("coord_chats");
      const storedMsgs = localStorage.getItem("coord_messages");

      if (storedChats) setChats(JSON.parse(storedChats));
      else {
        setChats(INITIAL_CHATS);
        localStorage.setItem("coord_chats", JSON.stringify(INITIAL_CHATS));
      }

      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
      else {
        setMessages(INITIAL_MESSAGES);
        localStorage.setItem("coord_messages", JSON.stringify(INITIAL_MESSAGES));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Scroll to bottom on message load/change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    
    // Clear unread
    const updatedChats = chats.map(c => {
      if (c.id === chatId) return { ...c, unread: false };
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem("coord_chats", JSON.stringify(updatedChats));
    setRecordedFileUrl(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !recordedFileUrl) return;

    const newMsg: IMessage = {
      id: Date.now(),
      sender: "coordinator",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(recordedFileUrl ? { file: recordedFileUrl } : {})
    };

    // Update messages
    const chatMsgs = messages[activeChatId] ? [...messages[activeChatId], newMsg] : [newMsg];
    const updatedMsgs = { ...messages, [activeChatId]: chatMsgs };
    setMessages(updatedMsgs);
    localStorage.setItem("coord_messages", JSON.stringify(updatedMsgs));

    // Update last message in chat list
    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: recordedFileUrl ? "🎤 Voice message" : inputMessage.trim(),
          time: "Just now"
        };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem("coord_chats", JSON.stringify(updatedChats));

    setInputMessage("");
    setRecordedFileUrl(null);
  };

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
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setRecordedFileUrl(base64data);
        };
        
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
      setRecordedFileUrl(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatRecTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatMessages = messages[activeChatId] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      <CoordinatorPageHeader
        eyebrow="Communication"
        title="Messages"
        description="Chat with mentors and researchers about submissions and applications."
      />

    <div className="w-full h-[calc(100vh-220px)] min-h-[520px] flex bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Chats List Sidebar */}
      <div className="w-full md:w-[350px] border-r border-white/5 flex flex-col h-full bg-[#111419]">
        <div className="p-5 border-b border-white/5 shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-[#00D1FF]" size={20} />
            Messages
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {chats.map(chat => {
            const active = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl transition-all text-left group ${
                  active 
                    ? "bg-gradient-to-r from-[#2A9D90]/15 to-[#6467F2]/10 border border-[#2A9D90]/25 shadow-lg" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Avatar text */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border relative ${
                  chat.role === "mentor" 
                    ? "bg-[#00D1FF]/10 border-[#00D1FF]/25 text-[#00D1FF]" 
                    : "bg-[#2A9D90]/10 border-[#2A9D90]/25 text-[#2A9D90]"
                }`}>
                  {chat.avatarText}
                  {chat.unread && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00D1FF] border border-[#111419]" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white truncate group-hover:text-[#00D1FF] transition-colors">{chat.name}</span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider">
                    {chat.role === "mentor" ? (
                      <span className="text-[#00D1FF] flex items-center gap-0.5"><GraduationCap size={11} /> Mentor</span>
                    ) : (
                      <span className="text-[#2A9D90] flex items-center gap-0.5"><User size={11} /> Researcher</span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? "text-gray-200 font-medium" : "text-gray-400"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation log */}
      <div className="flex-1 flex flex-col h-full bg-[#111827]">
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#111419]/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                  activeChat.role === "mentor" 
                    ? "bg-[#00D1FF]/10 border-[#00D1FF]/25 text-[#00D1FF]" 
                    : "bg-[#2A9D90]/10 border-[#2A9D90]/25 text-[#2A9D90]"
                }`}>
                  {activeChat.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{activeChat.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold">
                    {activeChat.role === "mentor" ? (
                      <span className="text-[#00D1FF] flex items-center gap-0.5"><GraduationCap size={11} /> Mentor Account</span>
                    ) : (
                      <span className="text-[#2A9D90] flex items-center gap-0.5"><User size={11} /> Researcher Account</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Message log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p>Send a message to start the conversation.</p>
                </div>
              ) : (
                activeChatMessages.map(msg => {
                  const isMe = msg.sender === "coordinator";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] space-y-1 ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe 
                          ? "bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white rounded-tr-none" 
                          : "bg-[#1F2937]/60 text-gray-200 border border-white/5 rounded-tl-none"
                      }`}>
                        {msg.file && (
                          <div className="mb-2">
                            <AudioMessagePlayer url={msg.file} />
                          </div>
                        )}
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium px-1">{msg.time}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-[#111419]/50 flex flex-col gap-2">
              {recordedFileUrl && (
                <VoicePreviewPlayer fileUrl={recordedFileUrl} onRemove={() => setRecordedFileUrl(null)} />
              )}
              
              <form onSubmit={handleSendMessage} className="flex gap-3 relative items-center">
                {isRecording ? (
                  <div className="flex-1 bg-[#1F2937] border border-red-500/30 rounded-xl py-3 px-4 flex items-center justify-between text-sm text-white shadow-inner">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-gray-200 font-medium ml-1">Recording Voice...</span>
                      <span className="text-red-400 font-semibold font-mono">{formatRecTime(recordingTime)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Cancel recording"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-500 transition-colors"
                        title="Stop recording"
                      >
                        <Square size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder={`Send a message to ${activeChat.name}...`}
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white placeholder:text-gray-500 transition-all pr-12"
                    />
                    {inputMessage.trim() || recordedFileUrl ? (
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <Send size={16} />
                        Send
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-600/30 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all"
                        title="Record voice message"
                      >
                        <Mic size={18} />
                      </button>
                    )}
                  </>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
            <MessageSquare size={36} className="opacity-40" />
            <p>Select a chat conversation from the sidebar to view logs.</p>
          </div>
        )}
      </div>

    </div>
    </div>
  );
};

export default ConversationView;
