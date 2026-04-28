import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let w, h;
    const particles = [];
    const particleCount = 40;
    const mouse = { x: null, y: null };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 150 + 50;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 
          ? 'rgba(128, 0, 128, 0.08)' // Deep Purple
          : 'rgba(139, 0, 0, 0.08)';   // Dark Red
      }

      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            this.x -= dx * 0.005;
            this.y -= dy * 0.005;
          }
        }

        if (this.x < -this.size) this.x = w + this.size;
        if (this.x > w + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = h + this.size;
        if (this.y > h + this.size) this.y = -this.size;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = '#050505'; // Obsidian Black
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

export default CosmicBackground;
