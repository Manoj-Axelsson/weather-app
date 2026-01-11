"use client";

import { useState, useEffect } from "react";
import { Weather } from "@/app/types/weather";
// import {
//     Sun,
//     Cloud,
//     CloudRain,
//     CloudSnow,
//     CloudFog,
//     CloudLightning,
//     HelpCircle,
// } from "lucide-react";
import { deriveInsights } from "@/lib/insights";
import EnvironmentalMetric from "./EnvironmentalMetric";
import { Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Cloud, HelpCircle } from "lucide-react";

export default function WeatherComponent() {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [location, setLocation] = useState("Linköping");
    const [error, setError] = useState<string | null>(null);
    const [fetchTime, setFetchTime] = useState<string>("");

    const insights = weather ? deriveInsights(weather) : null;
    const isSnowing = insights?.flags.isSnowing;

    useEffect(() => {
        handleSubmit(undefined, "Linköping");
        const timer = setTimeout(() => setLocation(""), 100);
        return () => clearTimeout(timer);
    }, []);

    async function handleSubmit(e?: React.FormEvent, manualLocation?: string) {
        e?.preventDefault();
        setError(null);

        const targetCity = (manualLocation || location).trim();
        if (!targetCity) {
            setError("Invalid location");
            return;
        }

        try {
            const response = await fetch(
                `https://weather.lexlink.se/forecast/location/${encodeURIComponent(
                    targetCity
                )}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Location "${targetCity}" not found`);
                }
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            setWeather(data);
            setFetchTime(new Date().toLocaleTimeString());
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Background */}
            <div
                className={`fixed inset-0 -z-20 transition-all duration-1000 ease-in-out ${isSnowing
                    ? "bg-linear-to-b from-blue-500 via-blue-200 to-stone-100"
                    : "bg-linear-to-b from-teal-100 via-cyan-50 to-stone-100"
                    }`}
            />

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                    Bearing Weather System
                </h1>

                <p className="mt-3 text-lg text-slate-600">
                    A weather gauge for navigating unpredictable conditions.
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-lg italic text-slate-500">
                    <span>Designed to support planning ahead.</span>
                </div>
            </div>

            {error && (
                <div className="mx-auto max-w-md w-full bg-red-500/10 border border-red-500/5 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center">
                    {error}
                </div>
            )}

            {weather && (
                <div className="overflow-hidden rounded-3xl bg-white/40 shadow-2xl backdrop-blur-2xl border border-white/30">
                    <div className="p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                                    {weather.location.name}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Lat: {weather.lat}</span>
                                    <span>Lon: {weather.lon}</span>
                                </div>
                            </div>

                            <div className="text-8xl font-black tracking-tighter text-slate-800">
                                {weather.timeseries[0].temp}°C
                            </div>
                        </div>

                        {/* Environmental Metrics */}
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <EnvironmentalMetric
                                label="Condition"
                                value={weather.timeseries[0].summary}
                                icon={(() => {
                                    const summary =
                                        weather.timeseries[0].summary?.toLowerCase() || "";
                                    if (summary.includes("sun") || summary.includes("clear"))
                                        return <Sun className="w-8 h-8 text-amber-500" />;
                                    if (summary.includes("rain"))
                                        return <CloudRain className="w-8 h-8 text-blue-500" />;
                                    if (summary.includes("snow"))
                                        return <CloudSnow className="w-8 h-8 text-blue-300" />;
                                    if (summary.includes("thunder"))
                                        return <CloudLightning className="w-8 h-8 text-purple-500" />;
                                    if (summary.includes("fog"))
                                        return <CloudFog className="w-8 h-8 text-slate-400" />;
                                    if (summary.includes("cloud"))
                                        return <Cloud className="w-8 h-8 text-slate-500" />;
                                    return <HelpCircle className="w-8 h-8 text-slate-400" />;
                                })()}
                            />

                            <EnvironmentalMetric
                                label="Humidity"
                                value={weather.timeseries[0].humidity}
                                unit="%"
                            />

                            <EnvironmentalMetric
                                label="Wind"
                                value={weather.timeseries[0].windSpeed}
                                unit="m/s"
                            />

                            <EnvironmentalMetric
                                label="Visibility"
                                value={weather.timeseries[0].visibility}
                                unit="km"
                            />
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Station Status: Operational</span>
                            <span>Last Updated: {fetchTime}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="mt-4 flex flex-col items-center gap-3 w-full">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-50">
                    Enter city name or coordinates
                </p>

                <form onSubmit={handleSubmit} className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Search city..."
                        className="w-full bg-blue-50/80 backdrop-blur-md border border-slate-900/20 focus:border-slate-900/30 focus:bg-white p-5 pr-32 rounded-3xl text-slate-900 font-bold placeholder:text-slate-400 shadow-xl transition-all outline-hidden text-center"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-amber-400/70 text-slate-900 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400/90 active:scale-95 transition-all shadow-lg"
                    >
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}
