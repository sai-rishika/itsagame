import React, { useState, useEffect } from 'react';
import { PrankCard } from './components/PrankCard';
import { SuccessScreen } from './components/SuccessScreen';


export default function App() {
  const [victimName, setVictimName] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('r u monkey.?');
  const [screen, setScreen] = useState<'prank' | 'success'>('prank');
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Parse search params on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      const qParam = params.get('q');

      if (nameParam) {
        setVictimName(nameParam);
      }
      if (qParam) {
        setCustomQuestion(qParam);
      }
    }
  }, []);

  const handleYesClicked = (finalDodgeCount: number) => {
    setDodgeCount(finalDodgeCount);
    setScreen('success');
  };

  const handleReset = () => {
    setDodgeCount(0);
    setScreen('prank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950 transition-colors">
      {/* Decorative ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-bounce duration-1000">🍌</div>
        <div className="absolute bottom-12 right-12 text-6xl animate-bounce duration-700">🐒</div>
        <div className="absolute top-1/3 right-10 text-5xl">🌴</div>
        <div className="absolute bottom-1/3 left-10 text-5xl">✨</div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {screen === 'prank' ? (
          <PrankCard
            victimName={victimName}
            setVictimName={setVictimName}
            customQuestion={customQuestion}
            setCustomQuestion={setCustomQuestion}
            onYesClicked={handleYesClicked}
            onOpenGitHubGuide={() => setIsGitHubModalOpen(true)}
          />
        ) : (
          <SuccessScreen
            victimName={victimName}
            dodgeCount={dodgeCount}
            onReset={handleReset}
            onOpenGitHubGuide={() => setIsGitHubModalOpen(true)}
          />
        )}
      </main>

      {/* GitHub Deployment Helper Modal */}
      <GitHubGuideModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
