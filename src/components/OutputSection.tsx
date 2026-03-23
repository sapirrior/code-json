import React from 'react';
import { Download, CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tool } from '../types';
import { JsonExplorer } from './JsonExplorer';

interface OutputSectionProps {
  activeTool: Tool;
  output: string;
  error: string | null;
  handleDownload: () => void;
  handleCopy: (isInput: boolean) => void;
  copySuccess: boolean;
  input: string;
}

export function OutputSection({
  activeTool,
  output,
  error,
  handleDownload,
  handleCopy,
  copySuccess,
  input
}: OutputSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-end border-b border-ink/10 dark:border-whitex/10 pb-4">
        <h2 className="text-2xl font-serif font-bold text-ink dark:text-whitex flex items-center gap-3 transition-colors">
          <span className="text-orangex text-3xl">02</span> {activeTool === 'explorer' ? 'Explorer' : 'Output'}
        </h2>
        <div className="flex items-center gap-4">
          {output && (
            <>
              <button 
                onClick={handleDownload}
                className="text-greyx hover:text-ink dark:hover:text-whitex transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-wider"
              >
                <Download size={12} /> Download
              </button>
              <button 
                onClick={() => handleCopy(false)}
                className="text-greyx hover:text-ink dark:hover:text-whitex transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-wider"
              >
                {copySuccess ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                {copySuccess ? 'Copied' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="card-anthropic h-[500px] lg:h-full min-h-[30rem] overflow-auto p-8 relative">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-red-600 dark:text-red-400 gap-4"
            >
              <AlertCircle size={40} className="opacity-50" />
              <p className="font-mono text-center text-xs leading-relaxed max-w-xs font-medium">{error}</p>
            </motion.div>
          ) : activeTool === 'explorer' ? (
            <JsonExplorer data={input} />
          ) : (
            <motion.pre 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all text-ink/80 dark:text-whitex/80 transition-colors"
            >
              {output || <span className="text-greyx/30 italic">Awaiting input for processing...</span>}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
