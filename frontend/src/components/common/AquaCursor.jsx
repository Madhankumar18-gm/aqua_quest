import React, { useEffect, useState } from 'react';

const AquaCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animFrame;
    let targetX = -100;
    let targetY = -100;
    let currX = -100;
    let currY = -100;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target;
      const isClickable =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.card-panel-3d') ||
        target.closest('.interactive-hover');

      setIsHovered(!!isClickable);
    };

    const onMouseDown = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseleave', onMouseLeave);

    const updatePosition = () => {
      // Smooth lerp (linear interpolation) for trailing effect
      currX += (targetX - currX) * 0.25;
      currY += (targetY - currY) * 0.25;
      setPosition({ x: currX, y: currY });
      animFrame = requestAnimationFrame(updatePosition);
    };

    animFrame = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: '-16px',
        top: '-16px',
      }}
    >
      {/* Outer Glow Halo */}
      <div
        className={`w-8 h-8 rounded-full border border-teal-400/50 bg-teal-400/10 backdrop-blur-[1px] transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered
            ? 'scale-150 border-sky-400 bg-sky-400/20 shadow-[0_0_20px_rgba(56,189,248,0.6)]'
            : 'shadow-[0_0_12px_rgba(20,184,166,0.3)]'
        } ${isClicked ? 'scale-90 bg-emerald-400/30' : ''}`}
      >
        {/* Inner Core Dot */}
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            isHovered ? 'bg-sky-300 scale-125' : 'bg-teal-300'
          }`}
        />
      </div>
    </div>
  );
};

export default AquaCursor;
