import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'square' | 'circle' | 'banana' | 'star';
  opacity: number;
}

const SHAPES = ['square', 'circle', 'banana', 'star'] as const;
const COLORS = ['#FACC15', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'];

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 12 + 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Reset particle when it drops off bottom
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.vy = Math.random() * 4 + 2;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.shape === 'banana') {
          ctx.fillStyle = '#FACC15';
          ctx.font = `${p.size * 1.5}px sans-serif`;
          ctx.fillText('🍌', -p.size / 2, p.size / 2);
        } else if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          ctx.font = `${p.size * 1.3}px sans-serif`;
          ctx.fillText('⭐', -p.size / 2, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
