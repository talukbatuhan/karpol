"use client";

import { useEffect } from "react";

type LocaleHtmlLangProps = {
  locale: string;
};

/** Syncs <html lang> for locale routes (root layout defaults to tr). */
export function LocaleHtmlLang({ locale }: LocaleHtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
