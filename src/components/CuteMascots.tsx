import React from 'react';

interface BlobProps {
  className?: string;
  size?: number;
  color?: string;
  expression?: 'smile' | 'glasses' | 'wink' | 'happy' | 'peace';
  accessory?: 'none' | 'partyHat' | 'camera' | 'glasses' | 'sunglasses' | 'heart';
  isWiggling?: boolean;
}

export const MascotBlob: React.FC<BlobProps> = ({
  className = '',
  size = 64,
  color = '#8374EB', // Default Purple Blob from reference image 1
  expression = 'smile',
  accessory = 'none',
  isWiggling = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isWiggling ? 'animate-cute-wiggle' : 'animate-cute-float'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform hover:scale-110 active:scale-95 duration-200"
      >
        {/* Soft Organic Blob Shape */}
        <path
          d="M82 32C92 48 88 72 73 83C58 94 32 93 18 80C4 67 2 42 13 25C24 8 48 2 68 8C78 11 80 20 82 32Z"
          fill={color}
        />

        {/* Highlight inner glow */}
        <ellipse cx="40" cy="22" rx="20" ry="10" fill="white" fillOpacity="0.25" />

        {/* Cheeks blush */}
        <ellipse cx="28" cy="56" rx="5" ry="3.5" fill="#FF5376" fillOpacity="0.3" />
        <ellipse cx="72" cy="56" rx="5" ry="3.5" fill="#FF5376" fillOpacity="0.3" />

        {/* Expression */}
        {expression === 'smile' && (
          <g fill="#1D2038">
            <ellipse cx="34" cy="46" rx="4" ry="4.5" />
            <ellipse cx="66" cy="46" rx="4" ry="4.5" />
            <path
              d="M40 58C44 65 56 65 60 58"
              stroke="#1D2038"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {expression === 'glasses' && (
          <g>
            {/* Round White Glasses frames like Image 2 Bob & Rob */}
            <circle
              cx="35"
              cy="46"
              r="14"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              fill="white"
              fillOpacity="0.2"
            />
            <circle
              cx="65"
              cy="46"
              r="14"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              fill="white"
              fillOpacity="0.2"
            />
            <line x1="49" y1="46" x2="51" y2="46" stroke="#FFFFFF" strokeWidth="4.5" />
            {/* Eyes inside glasses */}
            <circle cx="35" cy="46" r="3.5" fill="#1D2038" />
            <circle cx="65" cy="46" r="3.5" fill="#1D2038" />
            <circle cx="37" cy="44" r="1.2" fill="#FFFFFF" />
            <circle cx="67" cy="44" r="1.2" fill="#FFFFFF" />
            {/* Smile */}
            <path
              d="M44 63C47 67 53 67 56 63"
              stroke="#1D2038"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {expression === 'wink' && (
          <g fill="#1D2038">
            <ellipse cx="34" cy="46" rx="4" ry="4.5" />
            {/* Winking eye */}
            <path
              d="M60 48L66 43L72 48"
              stroke="#1D2038"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Happy open mouth */}
            <path
              d="M41 57C41 65 59 65 59 57Z"
              fill="#FF6584"
              stroke="#1D2038"
              strokeWidth="2.5"
            />
          </g>
        )}

        {expression === 'happy' && (
          <g stroke="#1D2038" strokeWidth="4" strokeLinecap="round">
            {/* Arc eyes */}
            <path d="M28 48C31 43 37 43 40 48" fill="none" />
            <path d="M60 48C63 43 69 43 72 48" fill="none" />
            {/* Big happy mouth */}
            <path
              d="M38 57C42 66 58 66 62 57"
              fill="#FF6584"
              stroke="#1D2038"
              strokeWidth="3"
            />
          </g>
        )}

        {expression === 'peace' && (
          <g stroke="#1D2038" strokeWidth="3.5" strokeLinecap="round">
            <ellipse cx="34" cy="47" rx="3.5" ry="4" fill="#1D2038" />
            <ellipse cx="66" cy="47" rx="3.5" ry="4" fill="#1D2038" />
            <path d="M43 59C47 64 53 64 57 59" fill="none" />
          </g>
        )}

        {/* Accessories */}
        {accessory === 'partyHat' && (
          <g>
            {/* Striped party cone hat for 2027 New Year */}
            <polygon points="50,2 34,22 66,22" fill="#FFD566" />
            <polygon points="46,7 38,17 48,17" fill="#FF8E85" />
            <polygon points="52,9 56,19 64,19" fill="#8374EB" />
            <circle cx="50" cy="2" r="3" fill="#FF8E85" />
          </g>
        )}

        {accessory === 'sunglasses' && (
          <g>
            <rect x="22" y="38" width="24" height="15" rx="5" fill="#1D2038" />
            <rect x="54" y="38" width="24" height="15" rx="5" fill="#1D2038" />
            <line x1="46" y1="44" x2="54" y2="44" stroke="#1D2038" strokeWidth="3" />
            {/* Glare */}
            <line x1="26" y1="42" x2="32" y2="48" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="42" x2="64" y2="48" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {accessory === 'heart' && (
          <g transform="translate(68, 6) scale(0.7)">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#FF6584"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

// Hand-drawn cute decorative doodles matching image 1 & 2
export const CuteDoodle: React.FC<{
  type: 'sun' | 'star' | 'squiggle' | 'flower' | 'sparkle' | 'camera';
  className?: string;
  size?: number;
  color?: string;
}> = ({ type, className = '', size = 32, color = '#FFD566' }) => {
  if (type === 'sun') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="20" cy="20" r="9" fill={color} />
        {/* Playful radiating rays */}
        <path
          d="M20 4V8M20 32V36M4 20H8M32 20H36M8.7 8.7L11.5 11.5M28.5 28.5L31.3 31.3M8.7 31.3L11.5 28.5M28.5 11.5L31.3 8.7"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="18" r="1.5" fill="#1D2038" />
        <circle cx="23" cy="18" r="1.5" fill="#1D2038" />
        <path d="M18 22C19 24 21 24 22 22" stroke="#1D2038" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* 8-point yellow sun/star from reference image 1 */}
        <path
          d="M18 2L20.8 12.2L31 9.4L23.8 17.2L32 23L21.8 22.8L21 34L15.8 24.8L6 30L9.8 20.2L2 16L12.2 14.2L11 4L18 2Z"
          fill={color}
        />
      </svg>
    );
  }

  if (type === 'squiggle') {
    return (
      <svg
        width={size}
        height={size * 0.7}
        viewBox="0 0 50 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Hand drawn cute curly loop like in reference 1 */}
        <path
          d="M5 22C12 18 18 8 26 8C34 8 36 20 28 22C20 24 22 10 32 10C38 10 42 16 46 22"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (type === 'flower') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Cute organic 4-petal flower shape from image 1 */}
        <circle cx="15" cy="15" r="9" fill={color} />
        <circle cx="25" cy="15" r="9" fill={color} />
        <circle cx="15" cy="25" r="9" fill={color} />
        <circle cx="25" cy="25" r="9" fill={color} />
        <circle cx="20" cy="20" r="5" fill="#FFE699" />
      </svg>
    );
  }

  // default sparkle
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
        fill={color}
      />
    </svg>
  );
};
