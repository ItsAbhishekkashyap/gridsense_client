export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <path d="M3 19 A12 12 0 0 1 27 19" fill="none" stroke="#FF5B1F" strokeWidth="2" />
      <circle cx="15" cy="19" r="5" fill="#FF5B1F" />
      <line x1="1" y1="19" x2="29" y2="19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
