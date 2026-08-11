import type { MessageInput, ContactReason } from "@/types";

/**
 * Human-readable labels for each contact reason (§9.2).
 * Used in email subject and body — bilingual per message locale.
 */
const REASON_LABELS: Record<ContactReason, { ar: string; en: string }> = {
    general:         { ar: "استفسار عام",                     en: "General Inquiry" },
    "bug-report":    { ar: "الإبلاغ عن مشكلة في مشروع",      en: "Project Issue Report" },
    academic:        { ar: "استفسار أكاديمي / بحثي",          en: "Academic / Research Inquiry" },
    collaboration:   { ar: "فرصة تعاون أو توظيف",             en: "Collaboration or Hiring Opportunity" },
};

/**
 * Generates an HTML email template for a new contact form message.
 * Contains all message details to help the owner make accept/reject decisions.
 * Updated per §9 — uses reason + projectRef instead of serviceType + budget.
 */
export function generateContactEmailHtml(message: MessageInput): string {
    const isArabic = message.locale === "ar";
    const dir = isArabic ? "rtl" : "ltr";
    const reasonLabel = REASON_LABELS[message.reason]?.[isArabic ? "ar" : "en"] ?? message.reason;

    return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${message.locale}">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
          direction: ${dir};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, hsl(150, 25%, 35%), hsl(150, 35%, 45%));
          color: white;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 20px;
        }
        .body {
          padding: 24px;
        }
        .field {
          margin-bottom: 16px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .field-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .field-value {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }
        .message-body {
          white-space: pre-wrap;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isArabic ? "📬 رسالة جديدة من موقعك الشخصي" : "📬 New Message from Your Portfolio"}</h1>
        </div>
        <div class="body">
          <div class="field">
            <div class="field-label">${isArabic ? "الاسم" : "Name"}</div>
            <div class="field-value">${message.senderName}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "البريد الإلكتروني" : "Email"}</div>
            <div class="field-value">${message.senderEmail}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "سبب التواصل" : "Reason"}</div>
            <div class="field-value">${reasonLabel}</div>
          </div>
          ${message.projectRef ? `
          <div class="field">
            <div class="field-label">${isArabic ? "المشروع المُبلَّغ عنه" : "Project Reported"}</div>
            <div class="field-value">${message.projectRef}</div>
          </div>` : ""}
          <div class="field">
            <div class="field-label">${isArabic ? "تفاصيل الرسالة" : "Message"}</div>
            <div class="field-value message-body">${message.body}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates the email subject line for a contact form message.
 * Neutral, non-commercial framing per §9.1.
 */
export function generateContactEmailSubject(message: MessageInput): string {
    const isArabic = message.locale === "ar";
    const reasonLabel = REASON_LABELS[message.reason]?.[isArabic ? "ar" : "en"] ?? message.reason;
    return `[Portfolio] ${reasonLabel} — ${message.senderName}`;
}
