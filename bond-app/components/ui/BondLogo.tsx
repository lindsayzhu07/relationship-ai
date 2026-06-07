interface BondLogoProps {
  size?: number;
  className?: string;
}

export default function BondLogo({ size = 80, className = "" }: BondLogoProps) {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bond logo"
      >
        <circle cx="40" cy="40" r="39" fill="white" stroke="#f0dde7" strokeWidth="1" />
        {/* Outer heart */}
        <path
          d="M40 54 C40 54 22 44 22 32 C22 26 27 22 33 22 C36.5 22 39.5 24 40 26 C40.5 24 43.5 22 47 22 C53 22 58 26 58 32 C58 44 40 54 40 54Z"
          fill="#f4c0d1"
        />
        <path
          d="M40 54 C40 54 22 44 22 32 C22 26 27 22 33 22 C36.5 22 39.5 24 40 26 C40.5 24 43.5 22 47 22 C53 22 58 26 58 32 C58 44 40 54 40 54Z"
          fill="none"
          stroke="#d4537e"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner heart */}
        <path
          d="M40 48 C40 48 28 40 28 32 C28 28.5 30.5 26 34 26 C36.5 26 38.5 27.5 40 30 C41.5 27.5 43.5 26 46 26 C49.5 26 52 28.5 52 32 C52 40 40 48 40 48Z"
          fill="#fbeaf0"
        />
        {/* Dot trail */}
        <circle cx="40" cy="57" r="2" fill="#d4537e" opacity="0.5" />
        <circle cx="40" cy="63" r="1.2" fill="#d4537e" opacity="0.28" />
        {/* Accent dots */}
        <circle cx="28" cy="26" r="1.5" fill="#f4c0d1" opacity="0.7" />
        <circle cx="52" cy="26" r="1.5" fill="#f4c0d1" opacity="0.7" />
      </svg>
    </div>
  );
}
