const BrandIcon = ({ size = 24, strokeWidth = 1.6, className = "", ...props }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Subtle angled background shadow frame */}
            <rect
                x="13"
                y="10"
                width="40"
                height="45"
                rx="7"
                transform="rotate(-5 33 32)"
                stroke="currentColor"
                strokeWidth={strokeWidth * 0.75}
                opacity="0.3"
                strokeDasharray="3 3"
            />

            {/* Primary Foreground Film Card Frame */}
            <rect
                x="11"
                y="9"
                width="42"
                height="46"
                rx="8"
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />

            {/* Inner Photo Aperture Window */}
            <rect
                x="16"
                y="14"
                width="32"
                height="28"
                rx="4"
                stroke="currentColor"
                strokeWidth={strokeWidth * 0.75}
            />

            {/* Viewfinder Corner Ticks */}
            <path d="M19 18h-1.5v-1.5" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
            <path d="M43 18h1.5v-1.5" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
            <path d="M19 38h-1.5v1.5" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
            <path d="M43 38h1.5v1.5" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />

            {/* Center Optical Focus Ring / Reticle */}
            <circle cx="32" cy="28" r="7.5" stroke="currentColor" strokeWidth={strokeWidth * 0.7} strokeDasharray="3 2" />
            <circle cx="32" cy="28" r="2.5" stroke="currentColor" strokeWidth={strokeWidth * 0.7} />

            {/* Precision Integrated Center Plus (+) */}
            <line x1="32" y1="21.5" x2="32" y2="34.5" stroke="currentColor" strokeWidth={strokeWidth * 1.15} />
            <line x1="25.5" y1="28" x2="38.5" y2="28" stroke="currentColor" strokeWidth={strokeWidth * 1.15} />

            {/* Bottom Film Card Chin Details */}
            <line x1="16" y1="47.5" x2="36" y2="47.5" stroke="currentColor" strokeWidth={strokeWidth * 0.75} opacity="0.6" />
            <circle cx="43" cy="47.5" r="1.5" fill="currentColor" opacity="0.6" />
        </svg>
    );
};

export default BrandIcon;

