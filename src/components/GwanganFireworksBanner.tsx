import React, { useEffect, useRef } from 'react';

export const GwanganFireworksBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 250);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 250;
    };
    window.addEventListener('resize', handleResize);

    // Scattered 4-point cross stars & twinkle dots matching IMG_4313
    const crossStars = [
      { x: 0.08, y: 0.15, size: 7, color: '#FFFFFF' },
      { x: 0.18, y: 0.28, size: 8, color: '#FFA07A' },
      { x: 0.32, y: 0.20, size: 6, color: '#FFFFFF' },
      { x: 0.45, y: 0.22, size: 7, color: '#FFFFFF' },
      { x: 0.68, y: 0.24, size: 8, color: '#FFA07A' },
      { x: 0.74, y: 0.32, size: 6, color: '#FFFFFF' },
      { x: 0.83, y: 0.18, size: 7, color: '#FFA07A' },
      { x: 0.88, y: 0.22, size: 6, color: '#FFFFFF' },
      { x: 0.94, y: 0.36, size: 7, color: '#FFFFFF' },
      { x: 0.27, y: 0.76, size: 7, color: '#FFA07A' },
      { x: 0.47, y: 0.80, size: 8, color: '#FFA07A' },
      { x: 0.57, y: 0.82, size: 6, color: '#FFFFFF' },
      { x: 0.65, y: 0.74, size: 7, color: '#FFA07A' },
    ];

    // Starburst sprinkles matching IMG_4313
    const miniBursts = [
      { x: 0.06, y: 0.32, radius: 4 },
      { x: 0.24, y: 0.12, radius: 4 },
      { x: 0.73, y: 0.10, radius: 4 },
      { x: 0.87, y: 0.30, radius: 5 },
      { x: 0.96, y: 0.34, radius: 4 },
    ];

    // Dotted star dust
    const dust: { x: number; y: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      dust.push({
        x: Math.random(),
        y: Math.random() * 0.7,
        r: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep Navy Night Sky Gradient matching IMG_4313
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#11162B');
      skyGrad.addColorStop(0.65, '#1B213B');
      skyGrad.addColorStop(1, '#272E4C');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Star Dust
      dust.forEach((d) => {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = d.alpha * (0.6 + 0.4 * Math.sin(tick * 0.04 + d.x * 10));
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Cross Stars (+) matching IMG_4313
      crossStars.forEach((cs) => {
        const cx = cs.x * width;
        const cy = cs.y * height;
        const s = cs.size;
        ctx.save();
        ctx.strokeStyle = cs.color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(tick * 0.05 + cs.x * 20);

        ctx.beginPath();
        // vertical line
        ctx.moveTo(cx, cy - s);
        ctx.lineTo(cx, cy + s);
        // horizontal line
        ctx.moveTo(cx - s, cy);
        ctx.lineTo(cx + s, cy);
        ctx.stroke();
        ctx.restore();
      });

      // Draw Mini Starbursts matching IMG_4313
      miniBursts.forEach((mb) => {
        const mx = mb.x * width;
        const my = mb.y * height;
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.65 + 0.35 * Math.sin(tick * 0.03 + mb.x * 15);

        for (let a = 0; a < 6; a++) {
          const ang = (Math.PI / 3) * a;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx + Math.cos(ang) * mb.radius, my + Math.sin(ang) * mb.radius);
          ctx.stroke();
        }
        ctx.restore();
      });

      // -------------------------------------------------------------
      // THREE LARGE CASCADING FIREWORKS BLOOMS (matching IMG_4313)
      // -------------------------------------------------------------
      const breathe = Math.sin(tick * 0.03) * 0.08;

      const drawFireworkBloom = (
        centerX: number,
        centerY: number,
        scale: number,
        mainColor: string,
        lightColor: string
      ) => {
        ctx.save();

        // 8-point Core Star at Center
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const ang = (Math.PI / 4) * i;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(ang) * 9 * scale, centerY + Math.sin(ang) * 9 * scale);
          ctx.stroke();
        }

        // Inner glowing core
        ctx.fillStyle = '#FFE6CC';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Outer Arching Palm Petals & Trails
        const branchCount = 26;
        for (let i = 0; i < branchCount; i++) {
          const t = i / (branchCount - 1);
          // Angle ranges from -Math.PI * 0.95 to -Math.PI * 0.05 (upward hemisphere)
          const angle = -Math.PI * 0.95 + t * (Math.PI * 0.9);
          const reach = (65 + 20 * Math.sin(i * 1.7)) * scale * (1 + breathe);

          // Quadratic Bezier curved petal with gravity drooping
          const endX = centerX + Math.cos(angle) * reach;
          const endY = centerY + Math.sin(angle) * reach + Math.pow(reach / 60, 2) * 22;

          const ctrlX = centerX + Math.cos(angle) * (reach * 0.55);
          const ctrlY = centerY + Math.sin(angle) * (reach * 0.55) - 8 * scale;

          ctx.strokeStyle = i % 2 === 0 ? mainColor : lightColor;
          ctx.lineWidth = 2.2 * scale;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
          ctx.stroke();

          // Cascading droplet dots trailing below each petal tip
          const trailCount = 3 + (i % 3);
          for (let k = 1; k <= trailCount; k++) {
            const dotY = endY + k * (7 * scale) + Math.sin(tick * 0.05 + i + k) * 2;
            const dotX = endX + (Math.sin(k * 0.8) * 2);
            ctx.fillStyle = k === 1 ? '#FFFFFF' : mainColor;
            ctx.beginPath();
            ctx.arc(dotX, dotY, (1.8 - k * 0.25) * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      };

      // 1. Center Bloom (Taller, Grandest)
      drawFireworkBloom(width * 0.5, height * 0.38, 1.15, '#FF8A65', '#FFCCBC');

      // 2. Left Bloom (Cascading over left bay)
      drawFireworkBloom(width * 0.16, height * 0.52, 0.9, '#FFA726', '#FFE0B2');

      // 3. Right Bloom (Cascading over right bay)
      drawFireworkBloom(width * 0.84, height * 0.52, 0.9, '#FFA726', '#FFE0B2');

      // -------------------------------------------------------------
      // GWANGAN BRIDGE & SEA (matching IMG_4313)
      // -------------------------------------------------------------
      const bridgeDeckY = height - 32;

      // Sea / Bay Water at bottom
      ctx.fillStyle = '#223253';
      ctx.fillRect(0, bridgeDeckY + 6, width, 32);

      // Sea gentle wavy reflection strokes
      ctx.strokeStyle = '#354B75';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(width * 0.12, bridgeDeckY + 16);
      ctx.lineTo(width * 0.24, bridgeDeckY + 16);
      ctx.moveTo(width * 0.55, bridgeDeckY + 22);
      ctx.lineTo(width * 0.72, bridgeDeckY + 22);
      ctx.stroke();

      // Suspension Towers
      const tower1X = width * 0.28;
      const tower2X = width * 0.72;
      const towerTopY = bridgeDeckY - 26;

      // Suspension Cables
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left approach
      ctx.moveTo(0, bridgeDeckY - 8);
      ctx.quadraticCurveTo(tower1X * 0.5, bridgeDeckY - 4, tower1X, towerTopY);
      // Center main span
      ctx.quadraticCurveTo(width * 0.5, bridgeDeckY - 6, tower2X, towerTopY);
      // Right approach
      ctx.quadraticCurveTo((tower2X + width) * 0.5, bridgeDeckY - 4, width, bridgeDeckY - 8);
      ctx.stroke();

      // Towers columns with illuminated lights
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(tower1X - 2.5, towerTopY, 5, bridgeDeckY - towerTopY);
      ctx.fillRect(tower2X - 2.5, towerTopY, 5, bridgeDeckY - towerTopY);

      // Bridge Road Deck Double Row
      ctx.fillStyle = '#2B3854';
      ctx.fillRect(0, bridgeDeckY, width, 6);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, bridgeDeckY);
      ctx.lineTo(width, bridgeDeckY);
      ctx.moveTo(0, bridgeDeckY + 6);
      ctx.lineTo(width, bridgeDeckY + 6);
      ctx.stroke();

      // White Pearl Illuminated Lights along cables matching IMG_4313
      const numLights = 32;
      for (let i = 0; i <= numLights; i++) {
        const t = i / numLights;
        const lx = t * width;
        let ly = bridgeDeckY - 8;

        if (lx < tower1X) {
          const ratio = lx / tower1X;
          ly = (1 - ratio) * (bridgeDeckY - 8) + ratio * towerTopY;
        } else if (lx < tower2X) {
          const ratio = (lx - tower1X) / (tower2X - tower1X);
          ly = towerTopY + 4 * (ratio - 0.5) * (ratio - 0.5) * (bridgeDeckY - 6 - towerTopY);
        } else {
          const ratio = (lx - tower2X) / (width - tower2X);
          ly = (1 - ratio) * towerTopY + ratio * (bridgeDeckY - 8);
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(lx, ly, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Deck light dots
      const numDeckDots = 30;
      for (let j = 0; j < numDeckDots; j++) {
        const dx = (j / (numDeckDots - 1)) * width;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(dx, bridgeDeckY + 3, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] bg-[#11162B]">
      <canvas ref={canvasRef} className="w-full h-56 block" />

      {/* Embedded Celebration Badge Directly on Homepage Banner (No Popup Window!) */}
      <div className="absolute top-3.5 left-4 right-4 z-10 flex items-center justify-between text-white pointer-events-none">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF7675] border border-white text-white">
            ★ 2027 廣安大橋跨年煙火 ★
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 drop-shadow-md">
            2027 HAPPY NEW YEAR!
          </h3>
          <p className="text-xs font-bold text-[#FFEAA7] drop-shadow-sm">
            元旦全天煙火綻放 · 釜山安妞新年快樂
          </p>
        </div>
      </div>
    </div>
  );
};
