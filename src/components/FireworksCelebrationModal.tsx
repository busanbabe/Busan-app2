import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface FireworksCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseSeconds?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

export const FireworksCelebrationModal: React.FC<FireworksCelebrationModalProps> = ({
  isOpen,
  onClose,
  autoCloseSeconds = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countdown, setCountdown] = useState(autoCloseSeconds);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSparkleSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(autoCloseSeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, autoCloseSeconds, onClose]);

  useEffect(() => {
    if (!isOpen) return;

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
    const rockets: FireworkRocket[] = [];
    const colors = ['#FFEAA7', '#FF7675', '#55EFC4', '#A29BFE', '#74B9FF', '#FED330', '#FD79A8'];

    const createExplosion = (x: number, y: number, baseColor?: string) => {
      const particleCount = 75 + Math.floor(Math.random() * 45);
      const chosenColor = baseColor || colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.4 ? chosenColor : '#FFFFFF',
          size: 1.8 + Math.random() * 2.5,
          decay: 0.012 + Math.random() * 0.015,
          gravity: 0.07,
        });
      }
      playSparkleSound();
    };

    createExplosion(width * 0.25, height * 0.35, '#FFEAA7');
    createExplosion(width * 0.75, height * 0.3, '#FF7675');
    createExplosion(width * 0.5, height * 0.25, '#74B9FF');

    let tick = 0;
    const render = () => {
      tick++;

      ctx.fillStyle = 'rgba(10, 15, 30, 0.25)';
      ctx.fillRect(0, 0, width, height);

      if (tick % 28 === 0) {
        const rx = width * 0.15 + Math.random() * width * 0.7;
        const targetY = height * 0.15 + Math.random() * height * 0.4;
        rockets.push({
          x: rx,
          y: height,
          targetY,
          vy: -(8 + Math.random() * 4),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all shadow-md"
          title={soundEnabled ? '靜音' : '開啟煙火音效'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all shadow-md"
          title="進入主頁"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Retro American Festive Greeting Card (Geometric Color Block - NO PHOTOS!) */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#FDFBF7] rounded-[36px] p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_0px_#FFEAA7] text-center overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-2 border-2 border-dashed border-slate-900/30 rounded-[28px] pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[11px] font-black tracking-widest uppercase text-slate-900 bg-[#FFEAA7] px-3.5 py-1 rounded-full border-2 border-slate-900">
            ★ BUSAN 2027 CELEBRATION ★
          </span>
        </div>

        <div className="py-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            2027
            <span className="block text-2xl sm:text-4xl text-[#FF7675] font-black mt-1">
              HAPPY NEW YEAR!
            </span>
          </h1>
          <p className="text-sm font-black text-slate-800 mt-2">
            釜山安妞 · 2027 元旦新年快樂！
          </p>
        </div>

        {/* 4 Member Geometric Badges in a Row */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-2.5 rounded-2xl bg-[#FFD2CC] border-2 border-slate-900 text-center">
            <span className="block text-xs font-black text-slate-900">Jessie</span>
            <span className="text-[10px] font-bold text-slate-700">總召</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FFEAA7] border-2 border-slate-900 text-center">
            <span className="block text-xs font-black text-slate-900">Jewel</span>
            <span className="text-[10px] font-bold text-slate-700">美食</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#D1F7EA] border-2 border-slate-900 text-center">
            <span className="block text-xs font-black text-slate-900">Kay</span>
            <span className="text-[10px] font-bold text-slate-700">拍照</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#D7EAFF] border-2 border-slate-900 text-center">
            <span className="block text-xs font-black text-slate-900">Jase</span>
            <span className="text-[10px] font-bold text-slate-700">導航</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed px-2 my-3">
          祝 Jessie、Jewel、Kay、Jase 釜山跨年之旅順利平安，燒肉吃飽飽、美照拍滿滿！🎉
        </p>

        {/* Action Button & Auto Close Hint */}
        <div className="mt-5 pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-bold">
            {countdown > 0 ? `${countdown} 秒後自動進入主頁` : '隨時可進入行程'}
          </span>

          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black shadow-md hover:bg-slate-800 transition-colors"
          >
            <span>進入行程</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
