"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { RubricCriterion } from "@/types/assessment";

interface RubricCriteriaEditorProps {
    criteria: RubricCriterion[];
    onChange: (criteria: RubricCriterion[]) => void;
}

const RubricCriteriaEditor = ({ criteria, onChange }: RubricCriteriaEditorProps) => {
    const update = (index: number, field: keyof RubricCriterion, value: string | number) => {
        const next = criteria.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        onChange(next);
    };

    const addRow = () => onChange([...criteria, { name: "", points: 10 }]);

    const removeRow = (index: number) => {
        if (criteria.length <= 1) return;
        onChange(criteria.filter((_, i) => i !== index));
    };

    const totalPoints = criteria.reduce((sum, c) => sum + (Number(c.points) || 0), 0);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Criteria</label>
                <span className="text-xs text-[#64748B]">Total: {totalPoints} pts</span>
            </div>
            {criteria.map((criterion, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={criterion.name}
                        onChange={(e) => update(index, "name", e.target.value)}
                        placeholder="Criterion name"
                        className="flex-1 px-3 py-2.5 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                    />
                    <input
                        type="number"
                        min={1}
                        value={criterion.points}
                        onChange={(e) => update(index, "points", Number(e.target.value))}
                        placeholder="Pts"
                        className="w-20 px-3 py-2.5 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                    />
                    <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={criteria.length <= 1}
                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-xs font-bold text-[#00D1FF] hover:text-[#00E5FF] transition-colors"
            >
                <Plus size={14} /> Add criterion
            </button>
        </div>
    );
};

export default RubricCriteriaEditor;
