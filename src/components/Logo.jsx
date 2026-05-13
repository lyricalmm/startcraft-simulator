export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 15 L60 38 L85 38 L65 55 L72 78 L50 63 L28 78 L35 55 L15 38 L40 38 Z"
        fill="none"
        stroke="url(#splitGradient)"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M85 10 Q85 20 95 20 Q85 20 85 30 Q85 20 75 20 Q85 20 85 10 Z"
        fill="#FF5A45"
      />
      <defs>
        <linearGradient id="splitGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="#00E5FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
