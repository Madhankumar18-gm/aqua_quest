import React, { useEffect, useRef } from 'react';

const Aqua3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D depth perspective shift
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    // Click interactive water ripples array
    const ripples = [];
    const handleMouseClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.random() * 60 + 80,
        opacity: 0.8,
        speed: Math.random() * 2 + 2,
      });
      if (ripples.length > 12) ripples.shift();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    // Create 3D Hydro Spheres
    const numSpheres = Math.min(24, Math.floor(width / 65));
    const spheres = Array.from({ length: numSpheres }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 800 + 100, // 3D Depth Z axis
      radius: Math.random() * 26 + 12,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseAngle: Math.random() * Math.PI * 2,
      colorHue: Math.random() > 0.5 ? 175 : 195, // Teal / Cyan / Blue
    }));

    // Create background light particles
    const numParticles = 40;
    const particles = Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.35 + 0.1,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let waveOffset = 0;
    let lightRayOffset = 0;

    const render = () => {
      // Smooth interpolation for mouse depth parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const parallaxX = (mouseX - width / 2) * 0.05;
      const parallaxY = (mouseY - height / 2) * 0.05;

      // Deep radial dark hydro gradient background
      ctx.clearRect(0, 0, width, height);
      const bgGrad = ctx.createRadialGradient(
        width / 2 + parallaxX,
        height / 2 + parallaxY,
        100,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.5, '#070f1e');
      bgGrad.addColorStop(1, '#04070d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Volumetric Caustic Underwater Light Beams
      lightRayOffset += 0.008;
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const rayAngle = 0.25 + Math.sin(lightRayOffset + i) * 0.05;
        const rayStartX = (width / 4) * i + Math.sin(lightRayOffset * 0.5 + i) * 80;

        ctx.beginPath();
        ctx.moveTo(rayStartX, 0);
        ctx.lineTo(rayStartX + 180, 0);
        ctx.lineTo(rayStartX + 180 + Math.tan(rayAngle) * height, height);
        ctx.lineTo(rayStartX + Math.tan(rayAngle) * height, height);
        ctx.closePath();

        const rayGrad = ctx.createLinearGradient(rayStartX, 0, rayStartX + Math.tan(rayAngle) * height, height);
        const rayAlpha = (0.04 + Math.sin(lightRayOffset + i * 1.5) * 0.02);
        rayGrad.addColorStop(0, `rgba(56, 189, 248, ${rayAlpha * 1.8})`);
        rayGrad.addColorStop(0.5, `rgba(20, 184, 166, ${rayAlpha})`);
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // Render subtle undulating 3D liquid bottom wave mesh
      waveOffset += 0.015;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
        const wave1 = Math.sin(x * 0.006 + waveOffset) * 25;
        const wave2 = Math.cos(x * 0.01 + waveOffset * 0.8) * 15;
        const y = height - 120 + wave1 + wave2 + parallaxY * 0.3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const waveGrad = ctx.createLinearGradient(0, height - 150, 0, height);
      waveGrad.addColorStop(0, 'rgba(20, 184, 166, 0.07)');
      waveGrad.addColorStop(1, 'rgba(14, 165, 233, 0.01)');
      ctx.fillStyle = waveGrad;
      ctx.fill();
      ctx.restore();

      // Render rising light water particles
      ctx.save();
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < -10) p.y = height + 10;
        ctx.beginPath();
        ctx.arc(p.x + parallaxX * 0.2, p.y + parallaxY * 0.2, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fill();
      });
      ctx.restore();

      // Render Interactive Click Ripples
      ctx.save();
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= 0.015;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Secondary inner echo ring
        if (r.radius > 15) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(20, 184, 166, ${r.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();

      // Render 3D Floating Hydro Orbs sorted by depth Z
      spheres.sort((a, b) => b.z - a.z);

      spheres.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.pulseAngle += s.pulseSpeed;

        // Bounce boundaries
        if (s.x < -50) s.x = width + 50;
        if (s.x > width + 50) s.x = -50;
        if (s.y < -50) s.y = height + 50;
        if (s.y > height + 50) s.y = -50;

        // Perspective projection scale based on Z depth
        const perspectiveScale = 600 / (600 + s.z);
        const currentRadius = Math.max(4, (s.radius + Math.sin(s.pulseAngle) * 3) * perspectiveScale);
        const renderX = s.x + parallaxX * perspectiveScale;
        const renderY = s.y + parallaxY * perspectiveScale;

        // 3D Specular Liquid Sphere Gradient
        ctx.save();
        ctx.beginPath();
        ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);

        const sphereGrad = ctx.createRadialGradient(
          renderX - currentRadius * 0.3,
          renderY - currentRadius * 0.3,
          currentRadius * 0.1,
          renderX,
          renderY,
          currentRadius
        );

        const alpha = Math.min(0.75, 0.2 + perspectiveScale * 0.5);

        if (s.colorHue === 175) {
          sphereGrad.addColorStop(0, `rgba(153, 246, 228, ${alpha})`);
          sphereGrad.addColorStop(0.4, `rgba(20, 184, 166, ${alpha * 0.7})`);
          sphereGrad.addColorStop(0.8, `rgba(13, 148, 136, ${alpha * 0.3})`);
          sphereGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
        } else {
          sphereGrad.addColorStop(0, `rgba(186, 230, 253, ${alpha})`);
          sphereGrad.addColorStop(0.4, `rgba(14, 165, 233, ${alpha * 0.7})`);
          sphereGrad.addColorStop(0.8, `rgba(3, 105, 161, ${alpha * 0.3})`);
          sphereGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
        }

        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // 3D Specular Highlight Crescent
        ctx.beginPath();
        ctx.arc(
          renderX - currentRadius * 0.3,
          renderY - currentRadius * 0.3,
          currentRadius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * alpha})`;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};

export default Aqua3DBackground;
