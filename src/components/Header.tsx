import React from 'react';
import { Sun, Moon, FileJson, CheckCircle2, ArrowRightLeft, Braces, Compass, Wrench, FileCode2, Table, SortAsc, Minimize, Quote, Search } from 'lucide-react';
import { Tool } from '../types';

interface HeaderProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  setError: (error: string | null) => void;
  setOutput: (output: string) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export function Header({ activeTool, setActiveTool, setError, setOutput, isDark, setIsDark }: HeaderProps) {
  const tools = [
    { id: 'formatter', icon: FileJson, label: 'Format' },
    { id: 'validator', icon: CheckCircle2, label: 'Validate' },
    { id: 'converter', icon: ArrowRightLeft, label: 'YAML' },
    { id: 'schema', icon: Braces, label: 'Schema' },
    { id: 'path', icon: Compass, label: 'Path' },
    { id: 'repair', icon: Wrench, label: 'Repair' },
    { id: 'typescript', icon: FileCode2, label: 'TS' },
    { id: 'csv', icon: Table, label: 'CSV' },
    { id: 'sort', icon: SortAsc, label: 'Sort' },
    { id: 'minify', icon: Minimize, label: 'Minify' },
    { id: 'escape', icon: Quote, label: 'Escape' },
    { id: 'explorer', icon: Search, label: 'Explore' }
  ];

  return (
    <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
      <div className="flex flex-col">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-ink dark:text-whitex leading-none transition-colors">Code Json</h1>
        <p className="text-greyx text-[12px] uppercase tracking-[0.4em] mt-4 font-semibold">Developer Suite \ {new Date().getFullYear()}</p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <nav className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id as Tool);
                setError(null);
                setOutput('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                activeTool === tool.id 
                  ? 'bg-ink text-whitex border-ink dark:bg-whitex dark:text-ink dark:border-whitex shadow-md' 
                  : 'text-ink/60 border-ink/10 dark:text-whitex/60 dark:border-whitex/10 hover:bg-ink/5 dark:hover:bg-whitex/5 hover:text-ink dark:hover:text-whitex'
              }`}
            >
              <tool.icon size={12} />
              <span className="text-xs font-medium">{tool.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/10 dark:border-whitex/20 bg-white dark:bg-card-dark hover:bg-ink/5 dark:hover:bg-whitex/5 transition-all text-ink dark:text-whitex shadow-sm"
        >
          {isDark ? (
            <>
              <Sun size={18} className="text-orangex" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={18} className="text-orangex" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
