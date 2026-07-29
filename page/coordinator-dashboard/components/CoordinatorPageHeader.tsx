import React from "react";

interface CoordinatorPageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const CoordinatorPageHeader = ({
    eyebrow = "Overview",
    title,
    description,
    action,
}: CoordinatorPageHeaderProps) => (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
            <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">{eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
            {description && <p className="text-gray-400 text-sm md:text-base font-medium">{description}</p>}
        </div>
        {action}
    </div>
);

export default CoordinatorPageHeader;
