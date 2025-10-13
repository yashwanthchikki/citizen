import { useState, useRef, useEffect } from 'react';
import PaperboySection from './sections/PaperboySection';
import MainFeedSection from './sections/MainFeedSection';
import VideoFeedSection from './sections/VideoFeedSection';

const MainApp = () => {
  const [currentSection, setCurrentSection] = useState(1); // 0: Paperboy, 1: Main Feed, 2: Video Feed
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentSection < 2) {
        // Swipe left - next section
        setCurrentSection(prev => prev + 1);
      } else if (diff < 0 && currentSection > 0) {
        // Swipe right - previous section
        setCurrentSection(prev => prev - 1);
      }
    }
  };

  // Update transform based on current section
  useEffect(() => {
    if (containerRef.current) {
      const translateX = -currentSection * 100;
      containerRef.current.style.transform = `translateX(${translateX}vw)`;
    }
  }, [currentSection]);

  return (
    <div className="h-screen overflow-hidden bg-paperboy-black">
      <div
        ref={containerRef}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ width: '300vw' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Section A - Paperboy News Search */}
        <div className="w-screen h-full">
          <PaperboySection />
        </div>

        {/* Section B - Main Feed (Pinterest-style) */}
        <div className="w-screen h-full">
          <MainFeedSection />
        </div>

        {/* Section C - Short Video Feed (TikTok-style) */}
        <div className="w-screen h-full">
          <VideoFeedSection />
        </div>
      </div>

      {/* Section Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSection === index ? 'bg-paperboy-red' : 'bg-paperboy-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainApp;