export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* First document */}
        <rect x="4" y="8" width="14" height="18" rx="2" className="fill-teal-500" opacity="0.8" />
        <line
          x1="7"
          y1="13"
          x2="15"
          y2="13"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="17"
          x2="15"
          y2="17"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="21"
          x2="12"
          y2="21"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Arrow */}
        <path
          d="M18 20L22 20M22 20L20 18M22 20L20 22"
          className="stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Second document */}
        <rect x="22" y="14" width="14" height="18" rx="2" className="fill-indigo-600 dark:fill-indigo-500" />
        <line
          x1="25"
          y1="19"
          x2="33"
          y2="19"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="33"
          y2="23"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="27"
          x2="30"
          y2="27"
          className="stroke-white dark:stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-none">QuickConvert</span>
        <span className="text-xs text-muted-foreground">File Converter</span>
      </div>
    </div>
  )
}
