import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BarChart3, Settings, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isGameOver, setIsGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(42);

  return (
    <div className="relative min-h-screen w-full bg-[#131313] font-sans text-[#e5e2e1] overflow-hidden scanlines">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 bg-[#131313]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#2a2a2a] transition-colors">
            <Menu className="w-6 h-6 text-[#00f0ff]" />
          </button>
        </div>
        <div className="font-headline text-2xl font-bold tracking-[0.2em] text-[#00f0ff]">
          {score.toString().padStart(4, '0')}
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#2a2a2a] transition-colors">
            <Settings className="w-6 h-6 text-[#00f0ff]" />
          </button>
        </div>
      </header>

      {/* Main Game Canvas: Vertical Split Screen */}
      <main className="flex h-screen w-full">
        {/* Left Zone: Neon Blue Player */}
        <div className="relative flex-1 bg-[#1c1b1b] flex border-r border-[#3b494b]/10">
          <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">
            {/* Obstacle */}
            <div className="absolute top-1/4 w-12 h-12 bg-[#ff4a8d] shadow-[0_0_20px_rgba(255,74,141,0.4)]" />
            {/* Path Indicator */}
            <div className="h-full w-[1px] bg-[#3b494b] opacity-10 absolute left-1/2" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">
            {/* Player 1 (Blue Ball) */}
            <div className="w-10 h-10 bg-[#00f0ff] rounded-full shadow-[0_0_25px_rgba(0,240,255,0.6)] z-10" />
            <div className="h-full w-[1px] bg-[#3b494b] opacity-10 absolute left-1/2" />
          </div>
          {/* Interaction Area */}
          <div className="absolute inset-0 z-20 cursor-pointer group active:bg-[#00f0ff]/5 transition-colors">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-10 h-10 text-[#00f0ff]" />
              <ChevronRight className="w-10 h-10 text-[#00f0ff]" />
            </div>
          </div>
        </div>

        {/* Right Zone: Neon Pink Player */}
        <div className="relative flex-1 bg-[#0e0e0e] flex">
          <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">
            {/* Player 2 (Pink Ball) */}
            <div className="w-10 h-10 bg-[#ff4a8d] rounded-full shadow-[0_0_25px_rgba(255,74,141,0.6)] z-10" />
            <div className="h-full w-[1px] bg-[#3b494b] opacity-10 absolute left-1/2" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">
            {/* Obstacles */}
            <div className="absolute top-1/3 w-12 h-12 bg-[#ff4a8d] shadow-[0_0_20px_rgba(255,74,141,0.4)]" />
            <div className="absolute top-[60%] w-12 h-12 bg-[#ff4a8d] shadow-[0_0_20px_rgba(255,74,141,0.4)]" />
            <div className="h-full w-[1px] bg-[#3b494b] opacity-10 absolute left-1/2" />
          </div>
          {/* Interaction Area */}
          <div className="absolute inset-0 z-20 cursor-pointer group active:bg-[#ff4a8d]/5 transition-colors">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-10 h-10 text-[#ff4a8d]" />
              <ChevronRight className="w-10 h-10 text-[#ff4a8d]" />
            </div>
          </div>
        </div>

        {/* HUD: Live Stats */}
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-30 px-8">
          <div className="flex justify-between w-full max-w-lg items-start">
            <div className="flex flex-col">
              <span className="font-headline text-xs tracking-[0.2em] opacity-60">连击</span>
              <span className="font-headline text-4xl font-bold text-[#00f0ff]">12</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline text-xs tracking-[0.2em] opacity-60">速度</span>
              <span className="font-headline text-4xl font-bold text-[#ff4a8d]">2.4x</span>
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#131313]/90 backdrop-blur-xl"
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
                  <p className="font-headline text-3xl font-bold text-[#00f0ff]">{score.toString().padStart(4, '0')}</p>
                </div>
                <div className="bg-[#353534] p-4">
                  <p className="font-headline text-[10px] tracking-widest text-[#849495] uppercase mb-1">已用时间</p>
                  <p className="font-headline text-3xl font-bold text-white">0:{time}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsGameOver(false)}
                  className="w-full h-16 bg-[#00f0ff] text-[#00363a] font-headline font-bold uppercase tracking-widest hover:bg-[#7df4ff] transition-colors flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" />
                  重新开始
                </button>
                <button className="w-full h-16 bg-[#353534] text-white font-headline font-bold uppercase tracking-widest hover:bg-[#3a3939] transition-colors flex items-center justify-center gap-3">
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
        <button className="flex-1 flex items-center justify-center bg-[#00f0ff] text-[#131313] transition-colors">
          <Play className="w-6 h-6 fill-current" />
        </button>
        <button className="flex-1 flex items-center justify-center text-[#e5e2e1] hover:bg-[#1c1b1b] transition-colors">
          <BarChart3 className="w-6 h-6" />
        </button>
        <button className="flex-1 flex items-center justify-center text-[#e5e2e1] hover:bg-[#1c1b1b] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
