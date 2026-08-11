// ==============================================
// Advanced Personal Page — Shared Types
// ==============================================

// ─────────────────────────────────────────────
// Locale
// ─────────────────────────────────────────────
export type Locale = "ar" | "en";

export type LocalizedField<T = string> = {
    ar: T;
    en: T;
};

// ─────────────────────────────────────────────
// Social Links
// ─────────────────────────────────────────────
export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    labelAr: string;
    labelEn: string;
    icon: string | null;
    order: number;
    isActive: boolean;
}

// ─────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────
export interface ProjectImage {
    id: string;
    url: string;
    altAr: string | null;
    altEn: string | null;
    order: number;
}

export interface Project {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string;
    summaryEn: string;
    bodyAr: string;
    bodyEn: string;
    previewUrl: string | null;
    repoUrl: string | null;
    skills: string[];
    buildTime: string | null;
    order: number;
    isPublished: boolean;
    isFeatured: boolean;
    images: ProjectImage[];
    createdAt: Date;
    updatedAt: Date;
}

// ─────────────────────────────────────────────
// Timeline
// ─────────────────────────────────────────────
export interface TimelineEntry {
    id: string;
    date: Date;
    dateTo: Date | null;
    age: number;
    titleAr: string;
    titleEn: string;
    storyAr: string;
    storyEn: string;
    imageUrl: string | null;
    order: number;
}

// ─────────────────────────────────────────────
// Survey
// ─────────────────────────────────────────────
export type SurveyQuestionType = "multiple_choice" | "free_text";

export interface SurveyQuestion {
    id: string;
    textAr: string;
    textEn: string;
    type: SurveyQuestionType;
    optionsAr: string[];
    optionsEn: string[];
    order: number;
    isRequired: boolean;
    isActive: boolean;
}

export interface SurveyResponseInput {
    questionId: string;
    answer: string;
}

export interface SurveySubmission {
    visitorId: string;
    locale: Locale;
    responses: SurveyResponseInput[];
}

// ─────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────

// §9.2 / §13.4 — replaces the old ServiceType (MVP | SaaS | AI Integration)
export type ContactReason = "general" | "bug-report" | "academic" | "collaboration";
export type EmailStatus = "pending" | "sent" | "failed";

export interface MessageInput {
    senderName: string;
    senderEmail: string;
    reason: ContactReason;
    projectRef?: string; // Only present when reason = "bug-report" (§9.3)
    body: string;
    locale: Locale;
}

export interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    reason: string;
    projectRef?: string | null;
    body: string;
    isRead: boolean;
    emailStatus: EmailStatus;
    locale: string;
    createdAt: Date;
}

// Theme type removed — site is dark-only per §2 of UI/UX spec v2.0

// ─────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
}

// ─────────────────────────────────────────────
// Admin Row Types — JSON-serialized (string dates)
// Used in admin CMS pages (client components)
// ─────────────────────────────────────────────
export interface ProjectRow {
    id: string;
    titleEn: string;
    titleAr: string;
    slug: string;
    isPublished: boolean;
    isFeatured: boolean;
    order: number;
}

export interface TimelineRow {
    id: string;
    date: string;
    dateTo: string | null;
    age: number;
    titleAr: string;
    titleEn: string;
    storyAr: string;
    storyEn: string;
    imageUrl: string | null;
    order: number;
}

export interface MessageRow {
    id: string;
    senderName: string;
    senderEmail: string;
    reason: string;
    projectRef?: string | null;
    body: string;
    isRead: boolean;
    emailStatus: string;
    createdAt: string;
}
