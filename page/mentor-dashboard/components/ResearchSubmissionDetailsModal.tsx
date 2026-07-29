"use client";
import React, { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getResearchIdeaById } from "@/services/mentor";
import { Loader2 } from "lucide-react";

interface ResearchSubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  onApprove?: () => void;
  onDecline?: () => void;
}

const ResearchSubmissionDetailsModal = ({ 
  isOpen, 
  onClose, 
  submission,
  onApprove,
  onDecline
}: ResearchSubmissionDetailsModalProps) => {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && submission?.id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const res = await getResearchIdeaById(submission.id);
          if (res?.status) {
            setDetails(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch research idea details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [isOpen, submission?.id]);

  if (!submission) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white">Research Submission Details</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-8 overflow-y-auto flex flex-col gap-8 flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-gray-400">Loading details...</p>
                </div>
              ) : details ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-3xl font-extrabold text-white leading-tight">{details.study_title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <p>Date: <span className="text-white">{new Date(details.created_at).toLocaleDateString()}</span></p>
                      <span>•</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        details.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        details.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        "bg-gray-500/10 text-gray-400 border border-white/5"
                      }`}>
                        {details.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Description</h4>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{details.study_descritions}</p>
                    </div>

                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Research Objectives</h4>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{details.research_objectives}</p>
                    </div>

                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Proposed Methodology</h4>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{details.perposed_methodology}</p>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-400">
                    <Info size={20} className="shrink-0" />
                    <p>
                      <span className="font-bold">Note:</span> If approved, this research will have a 3-month deadline from the approval date. The mentor will be required to upload proof of journal submission within this timeframe.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <p>Details could not be loaded.</p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
              <button
                onClick={onDecline}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
              >
                <X size={20} />
                Decline Submission
              </button>
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all"
              >
                Approve Research
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResearchSubmissionDetailsModal;
