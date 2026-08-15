import { describe, it, expect } from "vitest";
import {
    parseBuildTime,
    serializeBuildTime,
    formatBuildTime,
} from "./format-build-time";

describe("Format Build Time Utility Test Suite", () => {
    describe("parseBuildTime & serializeBuildTime", () => {
        it("should parse standard format '10:days'", () => {
            const parsed = parseBuildTime("10:days");
            expect(parsed).toEqual({ amount: 10, unit: "days" });
        });

        it("should parse standard format '3:weeks'", () => {
            const parsed = parseBuildTime("3:weeks");
            expect(parsed).toEqual({ amount: 3, unit: "weeks" });
        });

        it("should serialize amount and unit into standard format", () => {
            const str = serializeBuildTime(14, "days");
            expect(str).toBe("14:days");
        });

        it("should fallback gracefully for empty or invalid strings", () => {
            expect(parseBuildTime("")).toEqual({ amount: 1, unit: "days" });
            expect(parseBuildTime(null)).toEqual({ amount: 1, unit: "days" });
        });
    });

    describe("formatBuildTime Localization & Unit Conversion", () => {
        const mockEnDict: Record<string, string> = {
            day: "{count} day",
            days: "{count} days",
            week: "{count} week",
            weeks: "{count} weeks",
            month: "{count} month",
            months: "{count} months",
            year: "{count} year",
            years: "{count} years",
            and: " and ",
        };

        const mockArDict: Record<string, string> = {
            day_1: "يوم واحد",
            day_2: "يومان",
            day_few: "{count} أيام",
            day_many: "{count} يوماً",
            week_1: "أسبوع واحد",
            week_2: "أسبوعان",
            week_few: "{count} أسابيع",
            week_many: "{count} أسبوعاً",
            month_1: "شهر واحد",
            month_2: "شهران",
            month_few: "{count} أشهر",
            month_many: "{count} شهراً",
            year_1: "سنة واحدة",
            year_2: "سنتان",
            year_few: "{count} سنوات",
            year_many: "{count} سنة",
            and: " و ",
        };

        const tEn = (key: string, values?: Record<string, any>) => {
            let str = mockEnDict[key] || key;
            if (values) {
                Object.keys(values).forEach((k) => {
                    str = str.replace(`{${k}}`, String(values[k]));
                });
            }
            return str;
        };

        const tAr = (key: string, values?: Record<string, any>) => {
            let str = mockArDict[key] || key;
            if (values) {
                Object.keys(values).forEach((k) => {
                    str = str.replace(`{${k}}`, String(values[k]));
                });
            }
            return str;
        };

        it("should format 10 days as '1 week and 3 days' in English and 'أسبوع واحد و 3 أيام' in Arabic", () => {
            const resultEn = formatBuildTime("10:days", "en", tEn);
            expect(resultEn).toBe("1 week and 3 days");

            const resultAr = formatBuildTime("10:days", "ar", tAr);
            expect(resultAr).toBe("أسبوع واحد و 3 أيام");
        });

        it("should format 14 days as '2 weeks' in English and 'أسبوعان' in Arabic", () => {
            const resultEn = formatBuildTime("14:days", "en", tEn);
            expect(resultEn).toBe("2 weeks");

            const resultAr = formatBuildTime("14:days", "ar", tAr);
            expect(resultAr).toBe("أسبوعان");
        });

        it("should format 35 days as '1 month and 5 days' in English and 'شهر واحد و 5 أيام' in Arabic", () => {
            const resultEn = formatBuildTime("35:days", "en", tEn);
            expect(resultEn).toBe("1 month and 5 days");

            const resultAr = formatBuildTime("35:days", "ar", tAr);
            expect(resultAr).toBe("شهر واحد و 5 أيام");
        });

        it("should format 2 weeks as '2 weeks' in English and 'أسبوعان' in Arabic", () => {
            const resultEn = formatBuildTime("2:weeks", "en", tEn);
            expect(resultEn).toBe("2 weeks");

            const resultAr = formatBuildTime("2:weeks", "ar", tAr);
            expect(resultAr).toBe("أسبوعان");
        });
    });
});
