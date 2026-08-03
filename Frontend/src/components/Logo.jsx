import { Link } from "react-router-dom";

const LogoMark = () => (
  <svg
    className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logo-card" x1="10" x2="55" y1="8" y2="58">
        <stop stopColor="#38BDF8" />
        <stop offset="0.5" stopColor="#6366F1" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="logo-glow" x1="18" x2="47" y1="18" y2="47">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#BFDBFE" />
      </linearGradient>
    </defs>
    <rect x="7" y="14" width="34" height="42" rx="10" fill="#18181B" />
    <rect x="16" y="8" width="41" height="48" rx="12" fill="url(#logo-card)" />
    <rect
      x="21"
      y="13"
      width="31"
      height="38"
      rx="8"
      fill="#09090B"
      fillOpacity="0.9"
    />
    <circle cx="42" cy="23" r="5" fill="url(#logo-glow)" />
    <path
      d="M24 45L32.3 34.8C33.6 33.2 36 33.2 37.3 34.9L40.4 39L43.2 35.7C44.4 34.3 46.6 34.4 47.6 36L52 43.1V45C52 48.3 49.3 51 46 51H30C26.7 51 24 48.3 24 45Z"
      fill="url(#logo-glow)"
    />
    <path
      d="M10 25C10 21.7 12.7 19 16 19H20V50H16C12.7 50 10 47.3 10 44V25Z"
      fill="#27272A"
    />
    <path
      d="M49.5 6.5L51.4 11.1L56 13L51.4 14.9L49.5 19.5L47.6 14.9L43 13L47.6 11.1L49.5 6.5Z"
      fill="#FACC15"
    />
  </svg>
);

const Logo = ({ className = "" }) => (
  <Link
    to="/"
    className={`inline-flex items-center gap-3 rounded-xl text-left transition hover:opacity-90 ${className}`}
    aria-label="Post App home"
  >
    <LogoMark />
    <span className="leading-none">
      <span className="block text-lg font-black tracking-wide text-white sm:text-xl">
        Post App
      </span>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200 sm:text-xs">
        Visual Feed
      </span>
    </span>
  </Link>
);

export default Logo;
