import styles from "./Logo.module.css";

export default function Logo({ compact = false }) {
  return (
    <a href="#top" className={`${styles.logo} ${compact ? styles.compact : ""}`}>
      <svg
        className={styles.mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mohMark" x1="8" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1a2310" />
            <stop offset="1" stopColor="#111808" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="13" fill="url(#mohMark)" />
        <rect
          x="0.6"
          y="0.6"
          width="38.8"
          height="38.8"
          rx="12.4"
          stroke="#FFF0BA"
          strokeOpacity="0.35"
        />
        <path
          d="M10.5 28c2.4-7 5.6-11.8 9.5-14.4 3.9 2.6 7.1 7.4 9.5 14.4"
          stroke="#FFF0BA"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <path
          d="M14.2 28c1.7-4.7 3.9-7.9 5.8-9.6 1.9 1.7 4.1 4.9 5.8 9.6"
          stroke="#FFF0BA"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        <circle cx="20" cy="13.2" r="2.1" fill="#FFF0BA" />
      </svg>
      <span className={styles.wordmark}>
        <span className={styles.name}>Мох</span>
        {!compact && <span className={styles.tag}>ИИ для заявок</span>}
      </span>
    </a>
  );
}
