// components/ui/scroll-to-top.tsx
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScrollToTopProps {
  /** Threshold in pixels from the top when the button should appear (default: 400) */
  threshold?: number;
  /** Position classes for the button (default: 'bottom-6 right-6') */
  position?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the button only when scrolling up (default: false) */
  showOnScrollUp?: boolean;
}

export function ScrollToTop({
  threshold = 400,
  position = 'bottom-6 right-6',
  className = '',
  showOnScrollUp = false,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (showOnScrollUp) {
        // Show when scrolling up and past threshold
        if (currentScrollY > threshold && currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        setLastScrollY(currentScrollY);
      } else {
        // Simple visibility based on scroll position
        setIsVisible(currentScrollY > threshold);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, showOnScrollUp, lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-50 flex h-10 w-10 items-center justify-center
        rounded-full bg-primary text-primary-foreground
        shadow-lg transition-all duration-200
        hover:bg-primary/90 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        animate-in fade-in slide-in-from-bottom-2
        ${position}
        ${className}
      `}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}

// Optional: Alternative version with tooltip and different styles
export function ScrollToTopWithTooltip({
  threshold = 400,
  position = 'bottom-6 right-6',
  className = '',
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed z-50 ${position}`}>
      <button
        onClick={scrollToTop}
        className={`
          group relative flex h-12 w-12 items-center justify-center
          rounded-full bg-primary text-primary-foreground
          shadow-lg transition-all duration-200
          hover:bg-primary/90 hover:shadow-xl hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          animate-in fade-in zoom-in
          ${className}
        `}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />

        {/* Tooltip */}
        <span className="absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-700">
          Back to top
        </span>
      </button>
    </div>
  );
}
