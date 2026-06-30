import { AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_COMPLETE_CLASS =
  "flex h-5 w-5 items-center justify-center rounded-full border border-gold-500/70 bg-ivory-50/90 text-navy-900 shadow-sm backdrop-blur-[2px] transition-all duration-300 ease-out group-hover:scale-50 group-hover:opacity-0";

const ICON_DRAFT_CLASS =
  "flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-amber-500/80 bg-ivory-50/80 text-amber-700 shadow-sm backdrop-blur-[2px] transition-all duration-300 ease-out group-hover:scale-50 group-hover:opacity-0";

const HINT_LABEL_CLASS =
  "pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-navy-800/15 bg-ivory-50/98 px-2 py-1 text-[8px] font-medium leading-none text-navy-950 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 sm:text-[9px]";

export type EcatalogHotspotIconProps = {
  complete?: boolean;
  hint?: string;
};

export function EcatalogHotspotIcon({
  complete = true,
  hint,
}: EcatalogHotspotIconProps) {
  return (
    <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <span
        className={complete ? ICON_COMPLETE_CLASS : ICON_DRAFT_CLASS}
        aria-hidden
      >
        {complete ? (
          <ExternalLink className="h-2.5 w-2.5 stroke-[2.5]" />
        ) : (
          <AlertCircle className="h-2.5 w-2.5 stroke-[2.5]" />
        )}
      </span>
      {hint ? (
        <span className={cn(HINT_LABEL_CLASS, "scale-90")} aria-hidden>
          {hint}
        </span>
      ) : null}
    </span>
  );
}

export type EcatalogHotspotMarkerProps = EcatalogHotspotIconProps & {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  className?: string;
};

export function EcatalogHotspotMarker({
  x,
  y,
  w,
  h,
  complete = true,
  hint,
  title,
  className,
}: EcatalogHotspotMarkerProps) {
  return (
    <span
      data-ecatalog-hotspot=""
      className={cn(
        "group absolute z-10 flex cursor-pointer items-center justify-center",
        className,
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      }}
      title={title}
    >
      <EcatalogHotspotIcon complete={complete} hint={hint} />
    </span>
  );
}
