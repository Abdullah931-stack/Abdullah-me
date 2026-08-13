import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * i18n routing configuration.
 * Defines supported locales and default locale.
 */
export const routing = defineRouting({
    locales: ["ar", "en"],
    defaultLocale: "ar",
});

export type Locale = (typeof routing.locales)[number];

/**
 * Lightweight navigation wrappers for next-intl.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);

