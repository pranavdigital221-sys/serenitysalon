import React, { useState } from 'react';
import { SERENITY_LOGO_DATA_URI, SERENITY_LOGO_PATH } from '../../assets/logoBase64';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textVariant?: 'dark' | 'light';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textVariant = 'dark',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [retryWithDataUri, setRetryWithDataUri] = useState(false);

  const sizeDimensions = {
    sm: { img: 'w-8 h-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    lg: { img: 'w-12 h-12', text: 'text-2xl sm:text-3xl', sub: 'text-[11px]' },
    xl: { img: 'w-14 h-14', text: 'text-3xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Logo Container */}
      <div className={`relative ${sizeDimensions.img} rounded-full overflow-hidden shrink-0 border border-[#C9A66B]/30 shadow-xs bg-[#F7F5F1] flex items-center justify-center`}>
        {!imgError ? (
          <img
            src={retryWithDataUri ? SERENITY_LOGO_DATA_URI : (SERENITY_LOGO_PATH || SERENITY_LOGO_DATA_URI)}
            alt="Serenity Salon"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!retryWithDataUri) {
                setRetryWithDataUri(true);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          /* High-Fidelity Vector Monogram Botanical Emblem Fallback */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="48" fill="#1F3A26" />
            <circle cx="50" cy="50" r="43" stroke="#C9A66B" strokeWidth="1.5" strokeDasharray="3 3" />
            <path
              d="M50 20C40 28 35 40 38 52C40 60 46 66 50 78C54 66 60 60 62 52C65 40 60 28 50 20Z"
              fill="#C9A66B"
              fillOpacity="0.85"
            />
            <path
              d="M32 45C38 48 45 46 50 38C55 46 62 48 68 45C62 56 55 58 50 68C45 58 38 56 32 45Z"
              fill="#FDF1E4"
              fillOpacity="0.7"
            />
            <text
              x="50"
              y="58"
              fontFamily="Cinzel, serif"
              fontSize="24"
              fontWeight="bold"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              S
            </text>
          </svg>
        )}
      </div>

      {/* Typography Text */}
      {showText && (
        <div className="leading-tight">
          <span
            className={`font-heading ${sizeDimensions.text} font-bold tracking-tight block ${
              textVariant === 'dark' ? 'text-[#1F3A26]' : 'text-white'
            }`}
          >
            Serenity<span className="text-[#C9A66B]"> Salon</span>
          </span>
          <span
            className={`${sizeDimensions.sub} uppercase tracking-[0.2em] font-medium block ${
              textVariant === 'dark' ? 'text-[#6E6E6E]' : 'text-[#FDF1E4]/80'
            }`}
          >
            Luxury Beauty &amp; Wellness
          </span>
        </div>
      )}
    </div>
  );
};
