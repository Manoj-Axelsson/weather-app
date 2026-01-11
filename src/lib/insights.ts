import { Weather } from "@/app/types/weather";

export type InsightsResult = {
    currentConsiderations: string[];
    weeklyOutlook: string | null;
    flags: {
        isSnowing: boolean;
        isUnstable: boolean;
    };
};

export function deriveInsights(weather: Weather): InsightsResult {
    const now = weather.timeseries[0];

    const considerations: string[] = [];

    // --- Flags (used by UI, not messaging) ---

    const isSnowing =
        now.summary?.toLowerCase().includes("snow") ?? false;

    // --- Rule 1: Wind + precipitation ---

    if (now.windSpeed >= 8 && hasPrecipitation(now.summary)) {
        considerations.push(
            "Wind and precipitation may affect outdoor activities today."
        );
    }

    // --- Rule 2: Low visibility ---

    if (now.visibility <= 3) {
        considerations.push(
            "Reduced visibility may affect transport and travel."
        );
    }

    // --- Rule 3: Cold + precipitation ---

    if (now.temp <= 1 && hasPrecipitation(now.summary)) {
        considerations.push(
            "Cold temperatures combined with precipitation may create slippery conditions - Probability high"
        );
    }

    // --- Rule 4: Calm baseline (only if nothing else applies) ---

    if (considerations.length === 0) {
        considerations.push(
            "No significant weather-related disruptions are expected today."
        );
    }

    // --- Weekly outlook (very conservative v1) ---

    let weeklyOutlook = deriveWeeklyOutlook(weather);

    if (weather.timeseries.length >= 5) {
        const nextDays = weather.timeseries.slice(0, 7);

        const temps = nextDays.map(d => d.temp);
        const winds = nextDays.map(d => d.windSpeed);

        const precipitationDays = nextDays.filter(d =>
            d.summary?.toLowerCase().match(/rain|snow|sleet/)
        ).length;

        const tempVariance = calculateVariance(temps);
        const windVariance = calculateVariance(winds);

        const stability = classifyStability(
            tempVariance,
            windVariance,
            precipitationDays
        );

        if (stability === "stable") {
            weeklyOutlook =
                "Conditions appear generally stable over the coming days, which may support planning with fewer weather-related interruptions.";
        }

        if (stability === "variable") {
            weeklyOutlook =
                "The coming days show variable conditions, with shifts that may require flexibility when planning weather-sensitive activities.";
        }

        if (stability === "disruptive") {
            weeklyOutlook =
                "The period ahead includes signs of increased weather disruption, which may affect timing and continuity for outdoor or exposed work.";
        }
    }


    return {
        currentConsiderations: considerations,
        weeklyOutlook,
        flags: {
            isSnowing,
            isUnstable: weeklyOutlook?.includes("variable") ?? false,
        },
    };
}

/* ---------------- Helpers ---------------- */

function hasPrecipitation(summary?: string): boolean {
    if (!summary) return false;
    const s = summary.toLowerCase();
    return (
        s.includes("rain") ||
        s.includes("snow") ||
        s.includes("sleet")
    );
}

function deriveWeeklyOutlook(weather: Weather): string | null {
    if (!weather.timeseries || weather.timeseries.length < 5) {
        return null;
    }

    const temps = weather.timeseries.map(t => t.temp);
    const winds = weather.timeseries.map(t => t.windSpeed);

    const tempVariance = variance(temps);
    const windVariance = variance(winds);

    // Thresholds are deliberately coarse

    const isStable =
        tempVariance < 4 && windVariance < 6;

    if (isStable) {
        return "Conditions appear generally stable across the coming days - Low probability for weather-related interruptions.";
    }

    return "The week shows mixed and variable conditions, with changes that may affect planning at different times.";
}

function variance(values: number[]): number {
    const mean =
        values.reduce((a, b) => a + b, 0) / values.length;
    return (
        values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
        values.length
    );
}

function calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return (
        values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
        values.length
    );
}

function classifyStability(
    tempVariance: number,
    windVariance: number,
    precipitationDays: number
): "stable" | "variable" | "disruptive" {
    if (precipitationDays >= 3 || windVariance > 10) {
        return "disruptive";
    }

    if (tempVariance > 6 || windVariance > 6) {
        return "variable";
    }

    return "stable";
}
