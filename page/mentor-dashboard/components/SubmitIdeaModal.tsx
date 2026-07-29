"use client";
import React from "react";
import { X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitResearchIdea } from "@/services/mentor";

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

const SubmitIdeaModal = ({ isOpen, onClose, onSubmitSuccess }: SubmitIdeaModalProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("study_title", data.title);
      formData.append("study_descritions", data.description);
      formData.append("research_objectives", data.objectives);
      formData.append("perposed_methodology", data.methodology);

      const res = await submitResearchIdea(formData);
      
      if (res?.status) {
        toast.success(res.message || "Research idea submitted for review!");
        onSubmitSuccess?.(res.data);
        reset();
        onClose();
      } else {
        toast.error(res?.message || "Failed to submit research idea");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Submit New Research Idea</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Study Title <span className="text-red-500">*</span></label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter your research study title"
                  className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title.message as string}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Study Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={4}
                  placeholder="Provide a detailed description of your research idea"
                  className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
                {errors.description && <span className="text-xs text-red-500">{errors.description.message as string}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Research Objectives <span className="text-red-500">*</span></label>
                <textarea
                  {...register("objectives", { required: "Objectives are required" })}
                  rows={3}
                  placeholder="What are the main objectives of this research?"
                  className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
                {errors.objectives && <span className="text-xs text-red-500">{errors.objectives.message as string}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Proposed Methodology <span className="text-red-500">*</span></label>
                <textarea
                  {...register("methodology", { required: "Methodology is required" })}
                  rows={3}
                  placeholder="Describe your proposed research methodology"
                  className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
                {errors.methodology && <span className="text-xs text-red-500">{errors.methodology.message as string}</span>}
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-400">
                <Info size={20} className="shrink-0" />
                <p>
                  <span className="font-bold">Note:</span> Once submitted, your research idea will be reviewed by the coordinator. If approved, you'll have 3 months to complete the study and submit proof of journal submission.
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="flex-2 px-6 py-3 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubmitIdeaModal;
