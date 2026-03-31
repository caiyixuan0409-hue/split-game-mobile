import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BarChart3, Settings, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

// Types
type Lane = 0 | 1 | 2 | 3; // 0,1 for left zone; 2,3 for right zone
interface Obstacle {
  id: number;
  lane: Lane;
  y: number; // 0 to 100
}

export default function App() {
  // 1. State Initialization
  const [isGameOver, setIsGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [playerLanes, setPlayerLanes] = useState<[Lane, Lane]>([0, 2]); // [Left Player Lane, Right Player Lane]

  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const obstacleIdRef = useRef(0);
  const spawnTimerRef = useRef(0);

  // 2. Start Game Logic
  const startGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setCombo(0);
    setSpeed(1);
    setTime(0);
    setObstacles([]);
    setPlayerLanes([0, 2]);
    obstacleIdRef.current = 0;
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
  }, []);

  // 3. Game Loop
  useEffect(() => {
    if (isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const loop = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Update time
      setTime(prev => prev + dt / 1000);

      // Move obstacles
      setObstacles(prev => {
        const next = prev
          .map(obs => ({ ...obs, y: obs.y + speed * (dt / 15) }))
          .filter(obs => obs.y < 110);
        return next;
      });

      // Spawn obstacles
      spawnTimerRef.current += dt;
      const spawnInterval = 1500 / speed;
      if (spawnTimerRef.current > spawnInterval) {
        spawnTimerRef.current = 0;
        const lane = Math.floor(Math.random() * 4) as Lane;
        setObstacles(prev => [
          ...prev,
          { id: obstacleIdRef.current++, lane, y: -10 }
        ]);
      }

      // Increase speed over time
      setSpeed(prev => Math.min(prev + 0.00005 * dt, 4));

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isGameOver, speed]);

  // 4. Interaction Handlers
  const handleLaneChange = (zone: 'left' | 'right', direction: 'left' | 'right') => {
    if (isGameOver) return;
    setPlayerLanes(prev => {
      const next = [...prev] as [Lane, Lane];
      if (zone === 'left') {
        next[0] = direction === 'left' ? 0 : 1;
      } else {
        next[1] = direction === 'left' ? 2 : 3;
      }
      return next;
    });
  };

  // Helper for dual event support (Click + Touch)
  const withTouch = (fn: (...args: any[]) => void) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    },
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    }
  });

  return (
    <div className="relative min-h-screen w-full bg-[#131313] font-sans text-[#e5e2e1] overflow-hidden scanlines select-none touch-none">
      {/* Header - Ensure it doesn't block game clicks */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 bg-[#131313]/80 backdrop-blur-md pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="p-2 hover:bg-[#2a2a2a] transition-colors" {...withTouch(() => {})}>
            <Menu className="w-6 h-6 text-[#00f0ff]" />
          </button>
        </div>
        <div className="font-headline text-2xl font-bold tracking-[0.2em] text-[#00f0ff]">
          {Math.floor(score).toString().padStart(4, '0')}
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="p-2 hover:bg-[#2a2a2a] transition-colors" {...withTouch(() => {})}>
            <Settings className="w-6 h-6 text-[#00f0ff]" />
          </button>
        </div>
      </header>

      {/* Main Game Canvas */}
      <main className="flex h-screen w-full relative z-10">
        {/* Left Zone */}
        <div className="relative flex-1 bg-[#1c1b1b] flex border-r border-[#3b494b]/10 overflow-hidden">
          {/* Lane Lines */}
          <div className="absolute inset-0 flex pointer-events-none opacity-20">
            <div className="flex-1 border-r border-[#3b494b]" />
            <div className="flex-1" />
          </div>

          {/* Obstacles Left */}
          {obstacles.filter(o => o.lane < 2).map(obs => (
            <div
              key={obs.id}
              className="absolute w-12 h-12 bg-[#ff4a8d] shadow-[0_0_20px_rgba(255,74,141,0.4)]"
              style={{
                left: obs.lane === 0 ? '25%' : '75%',
                top: `${obs.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Player Left */}
          <div 
            className="absolute bottom-32 w-10 h-10 bg-[#00f0ff] rounded-full shadow-[0_0_25px_rgba(0,240,255,0.6)] z-20 transition-all duration-75"
            style={{ left: playerLanes[0] === 0 ? '25%' : '75%', transform: 'translateX(-50%)' }}
          />

          {/* Interaction Areas Left */}
          <div className="absolute inset-0 z-30 flex">
            <div 
              className="flex-1 cursor-pointer active:bg-[#00f0ff]/10"
              {...withTouch(() => handleLaneChange('left', 'left'))}
            />
            <div 
              className="flex-1 cursor-pointer active:bg-[#00f0ff]/10"
              {...withTouch(() => handleLaneChange('left', 'right'))}
            />
          </div>
        </div>

        {/* Right Zone */}
        <div className="relative flex-1 bg-[#0e0e0e] flex overflow-hidden">
          {/* Lane Lines */}
          <div className="absolute inset-0 flex pointer-events-none opacity-20">
            <div className="flex-1 border-r border-[#3b494b]" />
            <div className="flex-1" />
          </div>

          {/* Obstacles Right */}
          {obstacles.filter(o => o.lane >= 2).map(obs => (
            <div
              key={obs.id}
              className="absolute w-12 h-12 bg-[#ff4a8d] shadow-[0_0_20px_rgba(255,74,141,0.4)]"
              style={{
                left: obs.lane === 2 ? '25%' : '75%',
                top: `${obs.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Player Right */}
          <div 
            className="absolute bottom-32 w-10 h-10 bg-[#ff4a8d] rounded-full shadow-[0_0_25px_rgba(255,74,141,0.6)] z-20 transition-all duration-75"
            style={{ left: playerLanes[1] === 2 ? '25%' : '75%', transform: 'translateX(-50%)' }}
          />

          {/* Interaction Areas Right */}
          <div className="absolute inset-0 z-30 flex">
            <div 
              className="flex-1 cursor-pointer active:bg-[#ff4a8d]/10"
              {...withTouch(() => handleLaneChange('right', 'left'))}
            />
            <div 
              className="flex-1 cursor-pointer active:bg-[#ff4a8d]/10"
              {...withTouch(() => handleLaneChange('right', 'right'))}
            />
          </div>
        </div>

        {/* HUD */}
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-40 px-8">
          <div className="flex justify-between w-full max-w-lg items-start">
            <div className="flex flex-col">
              <span className="font-headline text-xs tracking-[0.2em] opacity-60">连击</span>
              <span className="font-headline text-4xl font-bold text-[#00f0ff]">{combo}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline text-xs tracking-[0.2em] opacity-60">速度</span>
              <span className="font-headline text-4xl font-bold text-[#ff4a8d]">{speed.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      </main>

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#131313]/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#2a2a2a] p-8 border-l-4 border-[#ff4a8d] shadow-[0_0_40px_rgba(0,219,233,0.05)] relative"
            >
              <div className="mb-12">
                <p className="font-headline text-sm tracking-[0.4em] text-[#ff4a8d] font-bold mb-2 uppercase">系统关键错误</p>
                <h2 className="font-headline text-6xl font-extrabold uppercase leading-none tracking-tighter text-white">游戏结束</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-[#353534] p-4">
                  <p className="font-headline text-[10px] tracking-widest text-[#849495] uppercase mb-1">最终得分</p>
                  <p className="font-headline text-3xl font-bold text-[#00f0ff]">{Math.floor(score).toString().padStart(4, '0')}</p>
                </div>
                <div className="bg-[#353534] p-4">
                  <p className="font-headline text-[10px] tracking-widest text-[#849495] uppercase mb-1">已用时间</p>
                  <p className="font-headline text-3xl font-bold text-white">{Math.floor(time)}s</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  {...withTouch(startGame)}
                  className="w-full h-16 bg-[#00f0ff] text-[#00363a] font-headline font-bold uppercase tracking-widest hover:bg-[#7df4ff] transition-colors flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" />
                  重新开始
                </button>
                <button className="w-full h-16 bg-[#353534] text-white font-headline font-bold uppercase tracking-widest hover:bg-[#3a3939] transition-colors flex items-center justify-center gap-3" {...withTouch(() => {})}>
                  <BarChart3 className="w-6 h-6" />
                  排行榜
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex h-20 bg-[#0e0e0e] z-50">
        <div className="flex-1 flex items-center justify-center bg-[#00f0ff] text-[#131313]" {...withTouch(() => {})}>
          <Play className="w-6 h-6 fill-current" />
        </div>
        <div className="flex-1 flex items-center justify-center text-[#e5e2e1] hover:bg-[#1c1b1b]" {...withTouch(() => {})}>
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="flex-1 flex items-center justify-center text-[#e5e2e1] hover:bg-[#1c1b1b]" {...withTouch(() => {})}>
          <Menu className="w-6 h-6" />
        </div>
      </nav>
    </div>
  );
}

