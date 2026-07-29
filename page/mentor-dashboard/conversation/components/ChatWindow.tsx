"use client";
import React, { useEffect, useRef } from "react";
import { Users, MoreVertical } from "lucide-react";
import Image from "next/image";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import { Chat, Message } from "@/types/chat";
import { ICurrentUser } from "@/types/auth/auth";

interface ChatWindowProps {
  activeConv: Chat | null;
  messages: Message[];
  currentUser: ICurrentUser | null;
  messageInput: string;
  setMessageInput: (val: string) => void;
  onSendMessage: () => void;
  sending: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
}

const ChatWindow = ({
  activeConv,
  messages,
  currentUser,
  messageInput,
  setMessageInput,
  onSendMessage,
  sending,
  selectedFile,
  setSelectedFile,
}: ChatWindowProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const internalMessagesEndRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // If we are within 100px of the bottom, we consider it "at bottom"
    isAtBottom.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (internalMessagesEndRef.current) {
      internalMessagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (messages.length > 0 && isAtBottom.current) {
      const timer = setTimeout(() => scrollToBottom("smooth"), 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    isAtBottom.current = true;
    const timer = setTimeout(() => scrollToBottom("auto"), 50);
    return () => clearTimeout(timer);
  }, [activeConv?.id]);

  if (!activeConv) {
    return (
      <div className="flex-1 bg-[#0B0F1A] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-2xl relative">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-inner">
          <Users size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Select a conversation</h3>
        <p className="text-gray-400 max-w-xs leading-relaxed">Choose a study group from the list on the left to start messaging and collaborating.</p>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0F1A] border border-white/5 rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl relative border-t-white/10">
      {/* Chat Header - Fixed at top with explicit height and flex properties */}
      <div className="h-20 shrink-0 px-6 border-b border-white/5 flex items-center justify-between bg-[#111827]/80 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1F2937] to-[#111827] text-blue-400 flex items-center justify-center border border-white/10 overflow-hidden relative shadow-lg">
            {activeConv.chatable?.thumbnail ? (
              <Image src={activeConv.chatable.thumbnail} alt="" fill className="object-cover" />
            ) : (
              <Users size={24} />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-[17px] font-bold text-white leading-none tracking-tight">{activeConv.chatable?.title || "Discussion Group"}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                {(activeConv.users?.length ?? 0) > 0
                  ? `${activeConv.users!.length} members`
                  : "Opportunity chat"}
              </span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
          <MoreVertical size={22} />
        </button>
      </div>

      {/* Messages Area - Scrollable */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 px-6 py-8 flex flex-col custom-scrollbar relative bg-[#0B0F1A]"
      >
        <div className="flex flex-col">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const isSameUser = prevMsg?.user_id === msg.user_id;

              return (
                <MessageItem 
                  key={msg.id} 
                  msg={msg} 
                  currentUser={currentUser}
                  isFirstInGroup={!isSameUser}
                />
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-20 select-none">
              <Users size={80} className="mb-4 text-gray-400" />
              <p className="text-gray-400 font-medium text-lg">No messages here yet</p>
            </div>
          )}
          <div ref={internalMessagesEndRef} className="pt-8" />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-[#0B0F1A]">
        <ChatInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          onSendMessage={onSendMessage}
          sending={sending}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[120px] pointer-events-none" />
    </div>
  );
};

export default ChatWindow;
