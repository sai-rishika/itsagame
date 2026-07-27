import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Share2, Check, RefreshCw, Github } from 'lucide-react';
import { soundManager } from '../utils/sound';

import curiousMonkeyImg from '../assets/images/curious_monkey_1785162913487.jpg';

interface PrankCardProps {
  victimName: string;
  setVictimName: (name: string) => void;
  customQuestion: string;
  setCustomQuestion: (q: string) => void;
  onYesClicked: (dodgeCount: number) => void;
  onOpenGitHubGuide: () => void;
}

const TOOLTIPS = [
  "click yes!",
  "nice try! click yes 🐒",
  "wrong button! click yes 👇",
  "you can't click NO! 😂",
  "press YES already! 🍌",
  "NO is disabled! click yes",
  "are you sure? click yes!",
  "nope! click yes 😜",
  "YES is right there! ✨",
];

export const PrankCard: React.FC<PrankCardProps> = ({
  victimName,
  setVictimName,
  customQuestion,
  setCustomQuestion,
  onYesClicked,
  onOpenGitHubGuide,
}) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [hasDodged, setHasDodged] = useState(false);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipText, setTooltipText] = useState('click yes!');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  // Synchronize sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  // Calculate dodging position safely within container / viewport bounds
  const moveNoButton = useCallback(() => {
    setDodgeCount((prev) => prev + 1);
    setHasDodged(true);
    soundManager.playBoing();
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(30);
    }

    // Pick a funny tooltip message
    const randomMsg = TOOLTIPS[Math.floor(Math.random() * TOOLTIPS.length)];
    setTooltipText(randomMsg);
    setShowTooltip(true);

    // Calculate boundary dimensions
    let containerWidth = 320;
    let containerHeight = 280;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerWidth = rect.width - 120; // Leave margin for button
      containerHeight = rect.height - 80;
    } else if (typeof window !== 'undefined') {
      containerWidth = Math.min(window.innerWidth - 120, 400);
      containerHeight = Math.min(window.innerHeight - 180, 300);
    }

    // Generate random coordinate centered relative to button initial position
    const minDist = 80;
    let newX = 0;
    let newY = 0;

    // Retry until new location is at least minDist away from current position
    for (let attempts = 0; attempts < 10; attempts++) {
      const rx = (Math.random() - 0.5) * containerWidth;
      const ry = (Math.random() - 0.5) * containerHeight;

      const dist = Math.sqrt(Math.pow(rx - noPosition.x, 2) + Math.pow(ry - noPosition.y, 2));
      if (dist >= minDist) {
        newX = rx;
        newY = ry;
        break;
      }
      newX = rx;
      newY = ry;
    }

    setNoPosition({ x: newX, y: newY });
  }, [noPosition.x, noPosition.y]);

  // Handle desktop mouse proximity or hover
  const handleNoMouseEnter = () => {
    moveNoButton();
  };

  // Handle touch for mobile
  const handleNoTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent accidental click execution
    moveNoButton();
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    moveNoButton();
  };

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (victimName.trim()) {
      url.searchParams.set('name', victimName.trim());
    } else {
      url.searchParams.delete('name');
    }
    if (customQuestion.trim() && customQuestion.trim() !== 'r u monkey.?') {
      url.searchParams.set('q', customQuestion.trim());
    } else {
      url.searchParams.delete('q');
    }

    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(null as unknown as boolean), 2500);
  };

  // Determine displayed question text
  const questionTitle = customQuestion.trim() || 'r u monkey.?';
  const fullDisplayName = victimName.trim() ? `${victimName.trim()}, ` : '';

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      {/* Top Bar Navigation Controls */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          onClick={toggleSound}
          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold text-xs rounded-full flex items-center gap-1.5 transition-colors border border-amber-300 dark:border-amber-700/50"
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 bg-amber-200/70 hover:bg-amber-300 dark:bg-amber-900/50 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 font-bold text-xs rounded-full flex items-center gap-1 transition-colors border border-amber-300/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done' : 'Customize'}</span>
          </button>

          <button
            onClick={onOpenGitHubGuide}
            className="px-3 py-1.5 bg-zinc-900 text-amber-300 hover:bg-zinc-800 font-bold text-xs rounded-full flex items-center gap-1 transition-colors shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </button>
        </div>
      </div>

      {/* Optional Customization Panel */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-100/90 dark:bg-zinc-800/90 border border-amber-300 dark:border-amber-700/50 p-4 rounded-2xl mb-4 space-y-3 overflow-hidden shadow-inner"
          >
            <div className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider">
              🍌 Customize Prank
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900/80 dark:text-amber-200/80 mb-1">
                Victim's Name (optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Alex, Sam, Bro..."
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900/80 dark:text-amber-200/80 mb-1">
                Custom Question:
              </label>
              <input
                type="text"
                placeholder="r u monkey.?"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleShareLink}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Prank Link'}</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline"
              >
                Close customization
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Card Container */}
      <div
        ref={containerRef}
        className="relative bg-white/90 dark:bg-zinc-900/90 border-2 border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden min-h-[420px] flex flex-col items-center justify-between"
      >
        {/* Background Decorative Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/50 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-300/40 dark:bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Monkey Image Artwork */}
        <div className="relative mb-2">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl mx-auto bg-amber-100"
          >
            <img
              src={curiousMonkeyImg}
              alt="Curious monkey"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Question Title */}
        <div className="my-2 max-w-sm">
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 leading-tight tracking-tight drop-shadow-sm">
            {fullDisplayName}
            <span className="text-amber-600 dark:text-amber-400 block mt-1">{questionTitle}</span>
          </h1>
          <p className="text-xs font-semibold text-amber-800/70 dark:text-amber-300/70 mt-2">
            Please answer truthfully below 👇
          </p>
        </div>

        {/* Dynamic Dodge Counter Badge */}
        {dodgeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="my-1 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/60 rounded-full text-xs font-black text-rose-700 dark:text-rose-300 shadow-sm"
          >
            Failed attempts to click NO: <span className="text-rose-600 dark:text-rose-400 text-sm">{dodgeCount}</span>
          </motion.div>
        )}

        {/* Interactive Buttons Area */}
        <div className="relative w-full py-6 flex items-center justify-center gap-6 min-h-[100px]">
          {/* YES Button - Fixed & Inviting */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onYesClicked(dodgeCount)}
            className="z-10 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
          >
            <span>YES 🐒</span>
          </motion.button>

          {/* NO Button - Dodging & Elusive */}
          <motion.div
            animate={hasDodged ? { x: noPosition.x, y: noPosition.y } : { x: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="relative z-20"
          >
            {/* Speech Bubble Tooltip above / beside dodging button */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-amber-950 text-amber-200 text-xs font-black rounded-xl shadow-xl border border-amber-400 pointer-events-none"
                >
                  {tooltipText}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-950 rotate-45 border-r border-b border-amber-400" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              ref={noBtnRef}
              onMouseEnter={handleNoMouseEnter}
              onTouchStart={handleNoTouchStart}
              onClick={handleNoClick}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-lg rounded-2xl shadow-lg transition-all cursor-pointer border-b-4 border-rose-800 touch-none select-none"
            >
              <span>NO 🚫</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Footer Subtext & Direct Share CTA */}
        <div className="w-full pt-3 border-t border-amber-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-amber-800/80 dark:text-amber-300/80">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1 hover:text-amber-950 dark:hover:text-amber-100 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{copiedLink ? 'Link Copied!' : 'Prank a friend'}</span>
          </button>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            {dodgeCount === 0 ? 'Try clicking NO if you can! 😜' : 'Keep trying! click YES!'}
          </span>
        </div>
      </div>
    </div>
  );
};
