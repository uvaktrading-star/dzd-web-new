import React, { useEffect, useState } from 'react';

interface PageLoaderProps {
  onFinish?: () => void; // optional callback when loading finishes
}

export default function PageLoader({ onFinish }: PageLoaderProps) {
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let progress = 0;

    const interval = setInterval(() => {
      // Smooth random increase
      progress += Math.random() * 10;
      if (progress >= 100) progress = 100;

      setWidth(progress);

      // When fully loaded
      if (progress === 100) {
        clearInterval(interval);

        // Fade out smoothly
        setTimeout(() => {
          setOpacity(0);
          if (onFinish) onFinish();
        }, 200); // fade duration
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-500`}
      style={{ opacity }}
    >
      {/* Top buffering bar */}
      <div className="h-1 w-full bg-transparent">
        <div
          className="h-1 bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>

      {/* Full-page overlay */}
      <div className="flex-1 flex items-center justify-center bg-black/50">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
