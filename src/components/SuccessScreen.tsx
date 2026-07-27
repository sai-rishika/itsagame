import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Share2, Check, RotateCcw, Sparkles, Trophy, Volume2, VolumeX, Github } from 'lucide-react';
import { ConfettiCanvas } from './ConfettiCanvas';
import { soundManager } from '../utils/sound';

import laughingMonkeyImg from '../assets/images/laughing_monkey_1785162897752.jpg';

interface SuccessScreenProps {
  victimName: string;
  dodgeCount: number;
  onReset: () => void;
  onOpenGitHubGuide: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  victimName,
  dodgeCount,
  onReset,
  onOpenGitHubGuide,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Play celebratory victory fanfare & laughing sound
    soundManager.playLaughingVictory();
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) {
      soundManager.playLaughingVictory();
    }
  };

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (victimName.trim()) {
      url.searchParams.set('name', victimName.trim());
    }
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const laughText = 'hahahhhahahah';
  const letters = laughText.split('');

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 dark:from-zinc-950 dark:via-amber-950 dark:to-yellow-950 flex flex-col items-center justify-between p-6 sm:p-10 overflow-y-auto text-center">
      {/* Full Screen Festive Particle Confetti */}
      <ConfettiCanvas />

      {/* Floating Header Toolbar */}
      <div className="w-full max-w-2xl flex items-center justify-between z-40 gap-2 mb-4">
        <button
          onClick={toggleSound}
          className="px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-amber-950 dark:text-amber-200 font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 shadow-md hover:bg-white transition-all border border-amber-300 dark:border-amber-700"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
        </button>

        <button
          onClick={onOpenGitHubGuide}
          className="px-4 py-2 bg-zinc-950 text-amber-300 hover:bg-zinc-800 font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 shadow-md transition-all"
        >
          <Github className="w-4 h-4" />
          <span>Deploy on GitHub</span>
        </button>
      </div>

      {/* Main Big Screen Laughing Content */}
      <div className="my-auto max-w-3xl w-full z-40 flex flex-col items-center justify-center space-y-6">
        {/* Laughing Monkey Hero Artwork */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-8 border-white dark:border-amber-400 shadow-2xl mx-auto bg-amber-200">
            <img
              src={laughingMonkeyImg}
              alt="Laughing monkey holding banana"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="absolute -top-3 -right-3 bg-yellow-400 text-amber-950 font-black px-4 py-1.5 rounded-full text-lg shadow-xl border-2 border-white flex items-center gap-1"
          >
            <Trophy className="w-5 h-5 text-amber-900" /> Confirmed!
          </motion.div>
        </motion.div>

        {/* BIG SCREEN DISPLAY: "hahahhhahahah" */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-2"
          >
            {letters.map((char, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -25, 0],
                  scale: [1, 1.25, 1],
                  rotate: [0, (index % 2 === 0 ? 10 : -10), 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: index * 0.08,
                  ease: 'easeInOut',
                }}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-amber-950 dark:text-amber-100 tracking-wider uppercase drop-shadow-md select-none font-mono"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Subtitle Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-1"
          >
            <h2 className="text-xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-200">
              {victimName.trim() ? `${victimName.trim()} admitted it! 🐒` : 'You admitted it! 🐒'}
            </h2>
            <p className="text-sm sm:text-lg font-bold text-amber-900/90 dark:text-amber-300/90">
              You clicked YES! Welcome to the monkey club! 🍌
            </p>
            {dodgeCount > 0 && (
              <p className="text-xs sm:text-sm font-semibold text-amber-950/80 dark:text-amber-300/80 bg-white/60 dark:bg-zinc-900/60 inline-block px-4 py-1.5 rounded-full border border-amber-300 dark:border-amber-700/50 mt-2 shadow-sm">
                You tried to escape {dodgeCount} time{dodgeCount > 1 ? 's' : ''} with NO, but YES is forever! 😂
              </p>
            )}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full max-w-md justify-center"
        >
          <button
            onClick={handleShareLink}
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-950 text-amber-200 hover:bg-amber-900 font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer border-b-4 border-black"
          >
            {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            <span>{copiedLink ? 'Prank Link Copied!' : 'Prank a Friend 🔗'}</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-amber-950 hover:bg-amber-50 font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer border-b-4 border-amber-200"
          >
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Play Again 🍌</span>
          </button>
        </motion.div>
      </div>

      {/* Footer Branding */}
      
    </div>
  );
};
