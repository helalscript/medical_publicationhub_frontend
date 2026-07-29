"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare, Shield, BookOpen, GraduationCap, Loader2 } from "lucide-react";
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

const ConversationView = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, IMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    
    // Clear unread
    const updatedChats = chats.map(c => {
      if (c.id === chatId) return { ...c, unread: false };
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem("coord_chats", JSON.stringify(updatedChats));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: IMessage = {
      id: Date.now(),
      sender: "coordinator",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          lastMessage: inputMessage.trim(),
          time: "Just now"
        };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem("coord_chats", JSON.stringify(updatedChats));

    setInputMessage("");
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
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 shrink-0 bg-[#111419]/50 flex gap-3">
              <input
                type="text"
                placeholder={`Send a message to ${activeChat.name}...`}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white placeholder:text-gray-500 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold shrink-0 flex items-center justify-center gap-1.5"
              >
                <Send size={16} />
                Send
              </button>
            </form>
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
