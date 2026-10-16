import React, { useState, useRef } from 'react';

const Card3D = ({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  });

  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - height / 2) / (height / 2)) * -maxTilt;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'none',
    });

    if (glare) {
      const glareX = (mouseX / width) * 100;
      const glareY = (mouseY / height) * 100;
      setGlareStyle({
        opacity: 0.25,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`,
        transition: 'none',
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    if (glare) {
      setGlareStyle({
        opacity: 0,
        transition: 'all 0.5s ease',
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style.transform ? { transform: style.transform, transition: style.transition } : {}}
      className={`relative transform-style-3d cursor-pointer ${className}`}
      {...props}
    >
      {/* Nested 3D Content Container */}
      <div className="relative z-10 transform-style-3d">{children}</div>

      {/* Dynamic Specular Light Glare Overlay */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20 transition-opacity duration-300"
          style={glareStyle}
        />
      )}
    </div>
  );
};

export default Card3D;
