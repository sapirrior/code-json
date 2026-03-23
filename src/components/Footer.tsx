import React from 'react';

export function Footer() {
  return (
    <footer className="mt-24 py-16 w-full max-w-7xl border-t border-ink/5 dark:border-whitex/5 flex flex-col md:flex-row justify-between items-start gap-8 text-greyx text-[12px] font-medium">
      <div className="flex flex-col gap-2">
        <p className="text-ink dark:text-whitex font-bold tracking-tight text-lg font-serif transition-colors">Code Json</p>
        <p>© {new Date().getFullYear()} Nolan Stark. All rights reserved.</p>
      </div>
    </footer>
  );
}
