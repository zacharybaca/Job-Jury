import React from 'react';

const JobJuryLogo = ({ className }) => {
  return (
    <svg
      /* Increased width to 320 to prevent text clipping on font fallback */
      viewBox="0 0 320 80"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. THE GAVEL (Judgment) */}
      <g className="gavel-icon">
        <rect x="20" y="25" width="45" height="20" rx="3" fill="white" />
        <line
          x1="42"
          y1="45"
          x2="42"
          y2="70"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* 2. THE MAGNIFYING GLASS (Investigation) */}
      <g className="search-icon">
        <circle
          cx="55"
          cy="40"
          r="22"
          stroke="#10b981"
          strokeWidth="5"
          fill="none"
        />
        <line
          x1="72"
          y1="56"
          x2="85"
          y2="70"
          stroke="#10b981"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* 3. THE TEXT */}
      <text
        x="100"
        y="55"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="38"
        fill="white"
      >
        Job<tspan fill="#10b981">Jury</tspan>
      </text>
    </svg>
  );
};

export default JobJuryLogo;
