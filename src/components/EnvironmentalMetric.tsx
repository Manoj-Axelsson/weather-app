"use client";

import React from "react";

type EnvironmentalMetricProps = {
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
};

export default function EnvironmentalMetric({
    label,
    value,
    unit,
    icon,
}: EnvironmentalMetricProps) {
    return (
        <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm hover:translate-y-[-2px] transition-transform flex flex-col items-center justify-center text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                {label}
            </div>

            {icon ? (
                <div className="mb-2">{icon}</div>
            ) : null}

            <div
                className={`${typeof value === "string"
                    ? "text-sm font-semibold text-slate-700"
                    : "text-xl font-black text-slate-800"
                    }`}
            >
                {value}
                {unit && (
                    <span className="text-xs font-bold text-slate-400 ml-1">
                        {unit}
                    </span>
                )}
            </div>

        </div>
    );
}
