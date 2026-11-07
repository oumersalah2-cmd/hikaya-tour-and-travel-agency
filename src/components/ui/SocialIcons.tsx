import type { SiteSettings } from "@/data/site";

/* Inline brand icons (lucide-react no longer ships brand logos). */
const paths: Record<keyof SiteSettings["social"], { label: string; d: string }> = {
  facebook: {
    label: "Facebook",
    d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  instagram: {
    label: "Instagram",
    d: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  tiktok: {
    label: "TikTok",
    d: "M16.6 2h-3.2v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.1 6.1 0 1 0 5.2 6V8.7a7.4 7.4 0 0 0 4.3 1.4V6.9a4.3 4.3 0 0 1-4.3-4.9Z",
  },
  telegram: {
    label: "Telegram",
    d: "M21.9 4.1 18.7 19.4c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 12.9 1.2 11.4c-1.1-.3-1.1-1 .2-1.6L20.6 2.4c.9-.3 1.700.2 1.300 1.700Z",
  },
  youtube: {
    label: "YouTube",
    d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.5 2.5 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800ZM10 15V9l5.200 3-5.200 3Z",
  },
};

export default function SocialIcons({
  social,
  className,
}: {
  social: SiteSettings["social"];
  className: string;
}) {
  const entries = (Object.keys(paths) as (keyof typeof paths)[]).filter((k) => social[k]);
  return (
    <>
      {entries.map((k) => (
        <a
          key={String(k)}
          href={social[k]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={paths[k].label}
          className={className}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d={paths[k].d} />
          </svg>
        </a>
      ))}
    </>
  );
}
