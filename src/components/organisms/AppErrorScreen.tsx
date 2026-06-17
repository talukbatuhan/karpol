"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SiteStatusScreen } from "@/components/organisms/SiteStatusScreen";
import { Button } from "@/components/ui/button";
import { ServiceError } from "@/services/_shared/errors";

export interface AppErrorScreenProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function AppErrorScreen({ error, reset }: AppErrorScreenProps) {
  const t = useTranslations("status");

  useEffect(() => {
    console.error(error);
  }, [error]);

  const description =
    error instanceof ServiceError
      ? t("serviceErrorDescription")
      : t("errorDescription");

  return (
    <div className="flex min-h-[60vh] flex-col">
      <SiteStatusScreen
        code={t("errorCode")}
        title={t("errorTitle")}
        description={description}
      />
      <div className="-mt-16 flex justify-center pb-16">
        <Button
          type="button"
          onClick={reset}
          className="font-mono text-xs uppercase tracking-widest"
        >
          {t("errorAction")}
        </Button>
      </div>
    </div>
  );
}
