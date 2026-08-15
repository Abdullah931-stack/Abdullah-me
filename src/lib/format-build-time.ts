export type TimeUnit = "days" | "weeks" | "months" | "years";

export interface ParsedBuildTime {
    amount: number;
    unit: TimeUnit;
}

/**
 * Parses buildTime string into amount and unit.
 * Format in DB: "amount:unit" e.g. "10:days", "3:weeks", "2:months", "1:years".
 * Supports legacy freeform strings as fallback.
 */
export function parseBuildTime(raw: string | null | undefined): ParsedBuildTime {
    if (!raw || !raw.trim()) {
        return { amount: 1, unit: "days" };
    }

    const trimmed = raw.trim();

    // Standard format "10:days"
    if (trimmed.includes(":")) {
        const [amtStr, unitStr] = trimmed.split(":");
        const amount = parseInt(amtStr, 10);
        const validUnits: TimeUnit[] = ["days", "weeks", "months", "years"];
        const unit = validUnits.includes(unitStr as TimeUnit)
            ? (unitStr as TimeUnit)
            : "days";
        return {
            amount: isNaN(amount) || amount < 1 ? 1 : amount,
            unit,
        };
    }

    // Fallback regex for legacy freeform strings
    const match = trimmed.match(/^(\d+)/);
    const amount = match ? parseInt(match[1], 10) : 1;

    let unit: TimeUnit = "days";
    const lower = trimmed.toLowerCase();
    if (
        lower.includes("year") ||
        lower.includes("سنة") ||
        lower.includes("سنوات")
    ) {
        unit = "years";
    } else if (
        lower.includes("month") ||
        lower.includes("شهر") ||
        lower.includes("أشهر")
    ) {
        unit = "months";
    } else if (
        lower.includes("week") ||
        lower.includes("أسبوع") ||
        lower.includes("أسابيع")
    ) {
        unit = "weeks";
    }

    return { amount: isNaN(amount) || amount < 1 ? 1 : amount, unit };
}

/**
 * Serializes amount and unit into DB format "10:days"
 */
export function serializeBuildTime(amount: number, unit: TimeUnit): string {
    const validAmount = isNaN(amount) || amount < 1 ? 1 : amount;
    return `${validAmount}:${unit}`;
}

/**
 * Formats a build time value into localized human-readable string based on locale.
 */
export function formatBuildTime(
    raw: string | null | undefined,
    locale: string,
    tUnits: (key: string, values?: Record<string, any>) => string
): string {
    if (!raw || !raw.trim()) return "";

    const { amount, unit } = parseBuildTime(raw);

    // Convert total input to total equivalent days
    let totalDays = amount;
    if (unit === "weeks") totalDays = amount * 7;
    else if (unit === "months") totalDays = amount * 30;
    else if (unit === "years") totalDays = amount * 365;

    // Decompose into years, months, weeks, days
    const years = Math.floor(totalDays / 365);
    const remYears = totalDays % 365;

    const months = Math.floor(remYears / 30);
    const remMonths = remYears % 30;

    const weeks = Math.floor(remMonths / 7);
    const days = remMonths % 7;

    const isAr = locale === "ar";
    const parts: string[] = [];

    // Helper for formatting single unit part according to locale plural rules
    const getUnitString = (
        count: number,
        unitType: "year" | "month" | "week" | "day"
    ) => {
        if (!isAr) {
            const key = count === 1 ? unitType : `${unitType}s`;
            return tUnits(key, { count });
        }

        // Arabic Pluralization Rules
        if (count === 1) {
            return tUnits(`${unitType}_1`);
        }
        if (count === 2) {
            return tUnits(`${unitType}_2`);
        }
        if (count >= 3 && count <= 10) {
            return tUnits(`${unitType}_few`, { count });
        }
        return tUnits(`${unitType}_many`, { count });
    };

    if (years > 0) parts.push(getUnitString(years, "year"));
    if (months > 0) parts.push(getUnitString(months, "month"));
    if (weeks > 0) parts.push(getUnitString(weeks, "week"));
    if (days > 0) parts.push(getUnitString(days, "day"));

    if (parts.length === 0) {
        return getUnitString(1, "day");
    }

    const andWord = tUnits("and");
    if (parts.length === 1) {
        return parts[0];
    }

    if (parts.length === 2) {
        return `${parts[0]}${andWord}${parts[1]}`;
    }

    // 3 or 4 parts: comma/and separated
    const last = parts.pop();
    const joinedFirst = isAr ? parts.join(" و ") : parts.join(", ");
    return `${joinedFirst}${andWord}${last}`;
}
