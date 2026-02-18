"use client";

import { useContext } from "react";
import { LocaleContext } from "@/components/shared/LocaleProvider";
import type { LocaleContextValue } from "@/components/shared/LocaleProvider";

export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
