import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }

      // Show after passing hero section (typically ~400px down)
      if (scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in-90 duration-300">
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top of page"
        title="Scroll to Top"
        className="group relative w-12 h-12 rounded-full bg-[#1F3A26] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-[#2A4D35] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#C9A66B]/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A66B]"
      >
        {/* Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-white/15 stroke-current"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-[#C9A66B] stroke-current transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Arrow Icon */}
        <ArrowUp className="w-5 h-5 text-[#E5C78A] group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />

        {/* Hover Tooltip */}
        <span className="absolute -top-9 right-1/2 translate-x-1/2 px-2.5 py-1 bg-[#1F3A26] text-[#E5C78A] text-[10px] font-bold rounded-lg shadow-lg border border-[#C9A66B]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Back to Top
        </span>
      </button>
    </div>
  );
};
