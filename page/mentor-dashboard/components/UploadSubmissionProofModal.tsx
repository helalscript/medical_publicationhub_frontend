"use client";
import React, { useState } from "react";
import { X, Upload, Info, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { uploadSubmissionProof } from "@/services/mentor";

interface UploadSubmissionProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  onSuccess?: () => void;
}

const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.webp";
const MAX_SIZE_MB = 10;

const UploadSubmissionProofModal = ({ isOpen, onClose, submission, onSuccess }: UploadSubmissionProofModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!submission) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`"${f.name}" exceeds ${MAX_SIZE_MB}MB limit`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
    // Reset input so same file can be re-added after removal
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }
    setIsUploading(true);
    try {
      const res = await uploadSubmissionProof(submission.id, files);
      if (res?.status) {
        toast.success(res.message || "Submission proof uploaded successfully!");
        setFiles([]);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
            className="relative w-full max-w-xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white">Upload Submission Proof</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              {/* Submission Summary */}
              <div className="bg-[#1F2937]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-1">{submission.title}</h3>
                {submission.deadline && (
                  <p className="text-sm text-gray-400">
                    Deadline: <span className="text-red-400 font-bold">{submission.deadline}</span>
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-300">
                <Info size={20} className="shrink-0 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-400 mb-1">Upload the journal submission email</p>
                  <p>Please upload the confirmation email or proof of submission from the journal. Accepted formats: PDF, PNG, JPG, JPEG, WEBP. You can add multiple files.</p>
                </div>
              </div>

              {/* Dropzone */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Select Files <span className="text-red-500">*</span>
                </label>

                <div
                  className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  onClick={() => document.getElementById("proof-file-upload")?.click()}
                >
                  <input
                    id="proof-file-upload"
                    type="file"
                    multiple
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="p-4 rounded-full bg-white/5 text-gray-400">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">Click to upload files</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG, PNG, WEBP (Max {MAX_SIZE_MB}MB each) — multiple allowed</p>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Upload size={14} className="text-emerald-400" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={files.length === 0 || isUploading}
                onClick={handleUpload}
                className="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  `Upload Proof${files.length > 1 ? ` (${files.length} files)` : ""}`
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadSubmissionProofModal;
