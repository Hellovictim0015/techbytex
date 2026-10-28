// SVG toy characters for the animated services page. Each toy wears a T-shirt
// with a badge in the middle — a technology name (C++, JS, AWS…) or a service
// icon — so the same character works for the background and the service cards.

export const BRAND = "#7C3AED";

// Technologies that play in the background: badge text + shirt / text colours.
export const TECH = {
  cpp: { label: "C++", shirt: "#00599C", text: "#fff" },
  js: { label: "JS", shirt: "#F7DF1E", text: "#111827" },
  ts: { label: "TS", shirt: "#3178C6", text: "#fff" },
  flutter: { label: "Flutter", shirt: "#02569B", text: "#7DD3FC" },
  reactNative: { label: "RN", shirt: "#20232A", text: "#61DAFB" },
  react: { label: "React", shirt: "#20232A", text: "#61DAFB" },
  aws: { label: "AWS", shirt: "#232F3E", text: "#FF9900" },
  python: { label: "Py", shirt: "#3776AB", text: "#FFD43B" },
  java: { label: "Java", shirt: "#E76F00", text: "#fff" },
  node: { label: "Node", shirt: "#339933", text: "#fff" },
  next: { label: "Next", shirt: "#000000", text: "#fff" },
  kotlin: { label: "Kt", shirt: "#7F52FF", text: "#fff" },
  swift: { label: "Swift", shirt: "#F05138", text: "#fff" },
  docker: { label: "Docker", shirt: "#2496ED", text: "#fff" },
  mysql: { label: "SQL", shirt: "#00758F", text: "#F29111" },
  html: { label: "HTML", shirt: "#E34F26", text: "#fff" },
};

// One toy character. `badge` is any React node shown on the T-shirt centre.
// mood: "happy" | "angry"; helmet: astronaut bubble; jetpack: flame on the back.
export function TechToy({
  badge,
  shirt = BRAND,
  text = "#fff",
  size = 64,
  mood = "happy",
  helmet = false,
  jetpack = false,
}) {
  const angry = mood === "angry";
  const badgeIsText = typeof badge === "string";
  const fontSize = badgeIsText ? Math.max(7, (size * (badge.length > 4 ? 0.13 : badge.length > 2 ? 0.17 : 0.22))) : undefined;

  return (
    <div className="relative" style={{ width: size, height: size * 1.2 }} aria-hidden="true">
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120" className="absolute inset-0 overflow-visible">
        {jetpack && (
          <g>
            <rect x="38" y="62" width="24" height="26" rx="6" fill="#94A3B8" />
            <path d="M42 88 50 112 58 88z" fill="#F59E0B">
              <animate attributeName="d" dur="0.35s" repeatCount="indefinite" values="M42 88 50 112 58 88z;M42 88 50 104 58 88z;M42 88 50 112 58 88z" />
            </path>
            <path d="M46 88 50 102 54 88z" fill="#FDE047" />
          </g>
        )}
        {/* legs + shoes */}
        <rect x="36" y="94" width="11" height="16" rx="4" fill="#334155" />
        <rect x="53" y="94" width="11" height="16" rx="4" fill="#334155" />
        <ellipse cx="41" cy="111" rx="8" ry="4.5" fill="#0F172A" />
        <ellipse cx="59" cy="111" rx="8" ry="4.5" fill="#0F172A" />
        {/* T-shirt */}
        <path d="M30 58 L16 68 L23 80 L31 75 L31 99 L69 99 L69 75 L77 80 L84 68 L70 58 Q50 66 30 58 Z" fill={shirt} />
        {/* hands */}
        <circle cx="19" cy="80" r="6" fill="#FDE2C4" />
        <circle cx="81" cy="80" r="6" fill="#FDE2C4" />
        {/* head */}
        <circle cx="50" cy="34" r="22" fill="#FDE2C4" />
        <path d="M28 32 Q30 10 50 11 Q70 10 72 32 Q62 22 50 23 Q38 22 28 32 Z" fill={shirt} />
        {angry ? (
          <>
            <path d="M36 30 L46 34" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M64 30 L54 34" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="42" cy="39" r="3.5" fill="#0F172A" />
            <circle cx="58" cy="39" r="3.5" fill="#0F172A" />
            <path d="M43 50 Q50 45 57 50" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="42" cy="37" rx="3.5" ry="4.5" fill="#0F172A" />
            <ellipse cx="58" cy="37" rx="3.5" ry="4.5" fill="#0F172A" />
            <circle cx="43" cy="35.5" r="1.3" fill="#fff" />
            <circle cx="59" cy="35.5" r="1.3" fill="#fff" />
            <path d="M42 46 Q50 53 58 46" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="35" cy="45" r="3.5" fill="#FB7185" opacity="0.45" />
            <circle cx="65" cy="45" r="3.5" fill="#FB7185" opacity="0.45" />
          </>
        )}
        {helmet && (
          <>
            <circle cx="50" cy="34" r="29" fill="#E0F2FE" fillOpacity="0.25" stroke="#BAE6FD" strokeWidth="3" />
            <path d="M33 20 Q38 12 46 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
          </>
        )}
      </svg>
      {/* badge printed on the T-shirt */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-black leading-none tracking-tight"
        style={{ top: "68%", color: text, fontSize, maxWidth: size * 0.36 }}
      >
        {badge}
      </div>
    </div>
  );
}

export function RocketToy({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 6c16 12 22 32 18 56H32C28 38 34 18 50 6z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="50" cy="36" r="9" fill="#C4B5FD" stroke={BRAND} strokeWidth="3" />
      <path d="M32 50 18 70l16-4zM68 50l14 20-16-4z" fill={BRAND} />
      <path d="M40 62h20l-4 12h-12z" fill="#94A3B8" />
      <path d="M44 74h12l-6 18z" fill="#F59E0B" />
    </svg>
  );
}

export function StarBurst({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon
        points="50,2 60,32 92,22 70,48 98,64 64,68 70,98 50,76 30,98 36,68 2,64 30,48 8,22 40,32"
        fill="#FDE047"
        stroke="#F59E0B"
        strokeWidth="3"
      />
      <text x="50" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill="#B45309" fontFamily="system-ui">
        POW!
      </text>
    </svg>
  );
}
