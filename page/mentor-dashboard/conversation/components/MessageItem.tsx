"use client";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Paperclip } from "lucide-react";
import { Message } from "@/types/chat";
import { ICurrentUser } from "@/types/auth/auth";

interface MessageItemProps {
  msg: Message;
  currentUser: ICurrentUser | null;
  isFirstInGroup?: boolean;
}

const MessageItem = ({ msg, currentUser, isFirstInGroup = true }: MessageItemProps) => {
  const isMe = msg.user_id === currentUser?.id;
  const time = format(new Date(msg.created_at), "h:mm a");

  const renderMessage = (text: string) => {
    if (!text) return "";
    // Basic bold text support (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-3 group ${!isFirstInGroup ? "mt-1.5" : "mt-6"}`}>
      {!isMe && (
        <div className={`w-10 h-10 rounded-full bg-[#1F2937] border border-white/10 overflow-hidden shrink-0 relative shadow-md transition-transform group-hover:scale-105 ${!isFirstInGroup ? "opacity-0 invisible h-0" : ""}`}>
          {msg.user?.avatar ? (
            <Image src={msg.user.avatar} alt={msg.user.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-[11px] font-bold">
              {msg.user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
      )}
      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && isFirstInGroup && (
          <p className="text-[11px] font-bold text-gray-500 pl-1 tracking-wide mb-0.5">
            {msg.user?.name} <span className="text-gray-600 font-normal ml-2">{time}</span>
          </p>
        )}
        <div
          className={`px-5 py-3 text-[15px] font-medium leading-[1.6] shadow-lg transition-all ${isMe
              ? "bg-[#2563EB] text-white/95 rounded-[22px] rounded-tr-[4px] shadow-blue-600/10 hover:bg-[#1d4ed8]"
              : "bg-[#1F2937] text-gray-100 rounded-[22px] rounded-tl-[4px] border border-white/5 hover:bg-[#262f3f]"
            } ${!isFirstInGroup ? (isMe ? "rounded-tr-[22px]" : "rounded-tl-[22px]") : ""}`}
        >
          {msg.file && (
            <div className="mb-2 max-w-sm rounded-lg overflow-hidden border border-white/10">
              {msg.file.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <a href={msg.file} target="_blank" rel="noopener noreferrer">
                  <Image 
                    src={msg.file} 
                    alt="attachment" 
                    width={300} 
                    height={200} 
                    className="object-cover w-full h-auto hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <a 
                  href={msg.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Paperclip size={16} />
                  <span className="text-xs truncate">{msg.file.split('/').pop()}</span>
                </a>
              )}
            </div>
          )}
          {msg.message && renderMessage(msg.message)}
        </div>
        {isMe && isFirstInGroup && <p className="text-[10px] font-medium text-gray-500 text-right pr-2 mt-0.5 tracking-tight">{time}</p>}
      </div>
      {isMe && (
        <div className={`w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 overflow-hidden shrink-0 relative shadow-md transition-transform group-hover:scale-105 ${!isFirstInGroup ? "opacity-0 invisible h-0" : ""}`}>
          {currentUser?.avatar ? (
            <Image src={currentUser.avatar} alt="Me" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-400 text-[11px] font-bold">Me</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
