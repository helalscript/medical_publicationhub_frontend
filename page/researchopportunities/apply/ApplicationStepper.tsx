"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    ArrowLeft,
    ArrowRight,
    GraduationCap,
    User,
    FileText,
    Calendar,
    ChevronDown,
    Upload,
    CheckCircle2,
    X,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Opportunity } from "@/types/opportunity";
import { submitOpportunityApplication } from "@/services/home";
import { toast } from "sonner";

interface ApplicationStepperProps {
    opportunity: Opportunity;
}

type FormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    highest_edu_level: string;
    institution: string;
    field_of_study: string;
    research_experience: string;
    personal_website: string;
    linkedin_profile: string;
    current_position: string;
    cover_letter: string;
    accept_term: boolean;
};

const ApplicationStepper = ({ opportunity }: ApplicationStepperProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            accept_term: true
        }
    });

    const steps = [
        { id: 1, name: "Personal Info", icon: User },
        { id: 2, name: "Background", icon: GraduationCap },
        { id: 3, name: "Documents", icon: FileText }
    ];

    const nextStep = async () => {
        let fieldsToValidate: (keyof FormData)[] = [];
        if (currentStep === 1) {
            fieldsToValidate = ['first_name', 'last_name', 'email'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['highest_edu_level', 'institution', 'research_experience'];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const formData = new window.FormData();
            formData.append("opportunity_id", String(opportunity.id));
            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("phone", data.phone || "");
            formData.append("highest_edu_level", data.highest_edu_level);
            formData.append("institution", data.institution);
            formData.append("field_of_study", data.field_of_study || "");
            formData.append("research_experience", data.research_experience);
            formData.append("current_position", data.current_position || "");
            formData.append("linkedin_profile", data.linkedin_profile || "");
            formData.append("personal_website", data.personal_website || "");
            formData.append("cover_letter", data.cover_letter);
            formData.append("accept_term", data.accept_term ? "1" : "0");

            if (selectedFile) {
                formData.append("documents[]", selectedFile);
            }

            const res = await submitOpportunityApplication(formData);
            if (res.status) {
                setIsSubmitted(true);
                toast.success(res.message || "Application submitted successfully");
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Submit Application Error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/researchopportunities"
                    className="flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Opportunities</span>
                </Link>

                <p className="text-[#A3A7AE] text-sm mb-6">Complete your application for:</p>

                {/* Opportunity Header Card */}
                <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 mb-12">
                    <h1 className="text-lg md:text-xl font-bold mb-4 text-[#EBEEF1] tracking-tight text-balance leading-tight">
                        {opportunity.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-[#A3A7AE]">
                        <div className="flex items-center gap-2.5">
                            <GraduationCap className="w-5 h-5 opacity-60 text-[#00D1FF]" strokeWidth={1.5} />
                            <span className="text-xs md:text-sm font-medium">
                                {opportunity.university_hospitals?.[0]?.name || "Collaborating Institution"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <User className="w-5 h-5 opacity-60 text-[#00D1FF]" strokeWidth={1.5} />
                            <span className="text-xs md:text-sm font-medium">
                                {opportunity.mentor?.user?.name || "Mentor"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Calendar className="w-5 h-5 opacity-60 text-[#00D1FF]" strokeWidth={1.5} />
                            <span className="text-xs md:text-sm font-medium">
                                Deadline: {new Date(opportunity.dead_line).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative px-4 md:px-12">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center gap-3 relative z-10 bg-[#0A0C0F] px-2">
                                <div
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${currentStep >= step.id
                                            ? "bg-[#00D1FF] border-[#00D1FF] shadow-[0_0_20px_rgba(0,209,255,0.3)] shadow-inner"
                                            : "bg-[#171A21] border-white/10"
                                        }`}
                                >
                                    <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${currentStep >= step.id ? "text-black" : "text-[#A3A7AE]"}`} strokeWidth={2} />
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold tracking-tight ${currentStep >= step.id ? "text-[#00D1FF]" : "text-[#A3A7AE]"}`}>
                                    {step.name}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="flex-1 h-[2px] bg-[#171A21] relative -mt-5">
                                    <motion.div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-[#111419] border border-white/5 rounded-[28px] p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-white tracking-tight">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">First Name *</label>
                                            <input
                                                {...register("first_name", { required: true })}
                                                type="text"
                                                placeholder="John"
                                                className={`w-full bg-[#171A21] border ${errors.first_name ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Last Name *</label>
                                            <input
                                                {...register("last_name", { required: true })}
                                                type="text"
                                                placeholder="Willson"
                                                className={`w-full bg-[#171A21] border ${errors.last_name ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Email Address *</label>
                                        <input
                                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                            type="email"
                                            placeholder="john.doe@university.edu"
                                            className={`w-full bg-[#171A21] border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Phone Number</label>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-[#171A21] border border-white/5 rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-white tracking-tight">Academic Background</h2>
                                    <div className="space-y-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Highest Education Level *</label>
                                            <input
                                                {...register("highest_edu_level", { required: true })}
                                                type="text"
                                                placeholder="e.g., PhD, Masters, Bachelors"
                                                className={`w-full bg-[#171A21] border ${errors.highest_edu_level ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Institution *</label>
                                            <input
                                                {...register("institution", { required: true })}
                                                type="text"
                                                placeholder="University of Example"
                                                className={`w-full bg-[#171A21] border ${errors.institution ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Field Of Study</label>
                                            <input
                                                {...register("field_of_study")}
                                                type="text"
                                                placeholder="e.g., Molecular Biology, Cardiology"
                                                className="w-full bg-[#171A21] border border-white/5 rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Research Experience *</label>
                                            <input
                                                {...register("research_experience", { required: true })}
                                                type="text"
                                                placeholder="e.g., 2 years in Lab, Expert"
                                                className={`w-full bg-[#171A21] border ${errors.research_experience ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Personal Website / Portfolio</label>
                                            <input
                                                {...register("personal_website")}
                                                type="text"
                                                placeholder="e.g., https://yourportfolio.com"
                                                className="w-full bg-[#171A21] border border-white/5 rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">LinkedIn Profile</label>
                                                <input
                                                    {...register("linkedin_profile")}
                                                    type="text"
                                                    placeholder="linkedin.com/in/username"
                                                    className="w-full bg-[#171A21] border border-white/5 rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Current Position</label>
                                                <input
                                                    {...register("current_position")}
                                                    type="text"
                                                    placeholder="e.g., Research Assistant"
                                                    className="w-full bg-[#171A21] border border-white/5 rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-white tracking-tight">Documents & Statement</h2>
                                    <div className="space-y-8">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Upload CV/Resume</label>
                                            <div className="border-2 border-dashed border-white/5 bg-[#171A21] rounded-2xl p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#00D1FF]/30 transition-all relative">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00D1FF]/10 transition-all">
                                                    <Upload className="w-5 h-5 text-[#A3A7AE] group-hover:text-[#00D1FF] transition-all" />
                                                </div>
                                                {selectedFile ? (
                                                    <div className="text-center">
                                                        <p className="text-[#00D1FF] font-bold text-sm mb-1">{selectedFile.name}</p>
                                                        <p className="text-[#64748B] text-xs font-medium">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-white font-bold text-sm mb-1">Click to upload or drag and drop</p>
                                                        <p className="text-[#64748B] text-xs font-medium">PDF, DOC, or DOCX (max. 10MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#A3A7AE] uppercase tracking-wider">Cover Letter / Statement of Interest *</label>
                                            <textarea
                                                {...register("cover_letter", { required: true })}
                                                rows={6}
                                                placeholder="Explain why you are interested in this position..."
                                                className={`w-full bg-[#171A21] border ${errors.cover_letter ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-4 px-5 text-sm md:text-base placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/40 transition-all font-medium resize-none`}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex gap-3 text-xs md:text-sm text-[#A3A7AE] font-medium leading-relaxed">
                                                <input
                                                    type="checkbox"
                                                    id="accept_term"
                                                    {...register("accept_term", { required: true })}
                                                    className="w-5 h-5 rounded border border-[#00D1FF] bg-[#00D1FF]/10 shrink-0 mt-0.5 accent-[#00D1FF]"
                                                />
                                                <label htmlFor="accept_term">
                                                    I confirm that all information provided is accurate and I agree to the <span className="text-[#00D1FF] cursor-pointer hover:underline">Privacy Policy</span> and <span className="text-[#00D1FF] cursor-pointer hover:underline">Terms of Service</span>.
                                                </label>
                                            </div>

                                            <div className="bg-[#171A21] border-l-4 border-[#00D1FF] p-5 rounded-r-xl">
                                                <div className="flex gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-[#00D1FF]/10 flex items-center justify-center shrink-0">
                                                        <Calendar className="w-3.5 h-3.5 text-[#00D1FF]" />
                                                    </div>
                                                    <p className="text-xs md:text-sm text-[#A3A7AE] font-semibold leading-relaxed">
                                                        Your application will be reviewed by the research team. You will be notified via email of the outcome.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className={`flex items-center gap-2 bg-[#171A21] border border-white/10 text-[#A3A7AE] hover:text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] ${currentStep === 1 || isSubmitting ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 hover:border-white/20"}`}
                            disabled={currentStep === 1 || isSubmitting}
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-extrabold py-3.5 px-8 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#00E5FF]/10"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#00E5FF]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4.5 h-4.5 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4.5 h-4.5" /> Submit Application
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {isSubmitted && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsSubmitted(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111419] border border-white/10 rounded-[32px] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl"
                        >
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="absolute top-6 right-6 text-[#A3A7AE] hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#8B8FF9] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#00D1FF]/20">
                                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Submit Application Successfull</h3>
                            <div className="w-full h-px bg-white/5 my-6" />
                            <Link
                                href="/researchopportunities"
                                className="block w-full bg-[#171A21] hover:bg-[#1C2129] border border-white/5 text-white font-bold py-4 rounded-2xl text-sm transition-all"
                            >
                                Back to Main Page
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ApplicationStepper;
