import Image from "next/image";

interface HikayaLogoProps {
  /**
   * "full" displays the emblem with "HIKAYA Travel Agency" wordmark.
   * "emblem" displays just the official angled pill & chevron emblem.
   */
  variant?: "full" | "emblem";
  /**
   * Set true when rendered over dark backgrounds (e.g. footer, hero, admin sidebar)
   * to ensure maximum contrast and legibility for "Travel Agency".
   */
  inverted?: boolean;
  /**
   * Size presets or custom height/width can be applied via className.
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Pass priority to Next.js Image for above-the-fold rendering.
   */
  priority?: boolean;
  /**
   * Force using the master extracted acrylic sign image (/images/logo.png).
   */
  useImageOnly?: boolean;
}

const sizeConfig = {
  sm: {
    height: 32,
    emblemWidth: 24,
    fullWidth: 100,
    textClass: "text-base",
    subtextClass: "text-[9px]",
  },
  md: {
    height: 40,
    emblemWidth: 30,
    fullWidth: 126,
    textClass: "text-xl",
    subtextClass: "text-[11px]",
  },
  lg: {
    height: 52,
    emblemWidth: 39,
    fullWidth: 163,
    textClass: "text-2xl",
    subtextClass: "text-xs",
  },
  xl: {
    height: 68,
    emblemWidth: 51,
    fullWidth: 214,
    textClass: "text-3xl",
    subtextClass: "text-sm",
  },
};

export default function HikayaLogo({
  variant = "full",
  inverted = false,
  size = "md",
  className = "",
  priority = false,
  useImageOnly = false,
}: HikayaLogoProps) {
  const cfg = sizeConfig[size];

  // Emblem-only variant
  if (variant === "emblem") {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <Image
          src="/images/logo-emblem.png"
          alt="HIKAYA Travel Agency"
          width={cfg.emblemWidth}
          height={cfg.height}
          priority={priority}
          className="h-auto w-auto object-contain drop-shadow-sm transition-transform duration-300"
          style={{ maxHeight: `${cfg.height}px` }}
        />
      </div>
    );
  }

  // Pure photographic logo image (best on white / light backgrounds)
  if (useImageOnly && !inverted) {
    return (
      <div className={`relative inline-flex items-center shrink-0 ${className}`}>
        <Image
          src="/images/logo.png"
          alt="HIKAYA Travel Agency"
          width={cfg.fullWidth}
          height={cfg.height}
          priority={priority}
          className="h-auto w-auto object-contain drop-shadow-sm"
          style={{ maxHeight: `${cfg.height}px` }}
        />
      </div>
    );
  }

  // Responsive / adaptive vector-hybrid variant (crisp typography & contrast on any background)
  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/images/logo-emblem.png"
          alt="HIKAYA Emblem"
          width={cfg.emblemWidth}
          height={cfg.height}
          priority={priority}
          className="h-auto w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          style={{ maxHeight: `${cfg.height}px` }}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-sans font-black tracking-wider text-accent-600 ${cfg.textClass} drop-shadow-sm`}
        >
          HIKAYA
        </span>
        <span
          className={`font-sans font-bold tracking-tight transition-colors duration-200 ${cfg.subtextClass} ${
            inverted
              ? "text-blue-200"
              : "text-primary-600 dark:text-blue-300"
          }`}
        >
          Travel Agency
        </span>
      </div>
    </div>
  );
}

