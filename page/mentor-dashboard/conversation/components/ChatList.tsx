"use client";
import React from "react";
import { Search, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Chat } from "@/types/chat";

interface ChatListProps {
  conversations: Chat[];
  activeConv: Chat | null;
  setActiveConv: (chat: Chat) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const ChatList = ({ conversations, activeConv, setActiveConv, searchQuery, setSearchQuery }: ChatListProps) => {
  const filteredConversations = conversations.filter((conv) =>
    conv.chatable?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 flex flex-col gap-4 overflow-hidden">
      <div className="relative shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full bg-[#111827] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2 custom-scrollbar">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveConv(conv)}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${activeConv?.id === conv.id
                  ? "bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-500/5"
                  : "bg-[#111827] border-white/5 hover:border-white/10"
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#1F2937] overflow-hidden flex items-center justify-center text-blue-400 shrink-0 border border-white/5 relative">
                {conv.chatable?.thumbnail ? (
                  <Image src={conv.chatable.thumbnail} alt={conv.chatable.title} fill className="object-cover" />
                ) : (
                  <Users size={24} />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-sm font-bold text-white truncate">{conv.chatable?.title}</h3>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {conv.type === "group" && (conv.users?.length ?? 0) > 0
                    ? `${conv.users!.length} members`
                    : "Opportunity chat"}
                </p>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
