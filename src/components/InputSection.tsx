import React, { useRef } from 'react';
import { CheckCircle2, Copy, Trash2, Upload, FileJson, Minimize, FileCode, Braces, Compass, Wrench, FileCode2, Table, SortAsc, Quote } from 'lucide-react';
import { Tool } from '../types';

interface InputSectionProps {
  activeTool: Tool;
  input: string;
  setInput: (input: string) => void;
  jsonPath: string;
  setJsonPath: (path: string) => void;
  handleCopy: (isInput: boolean) => void;
  copyInputSuccess: boolean;
  handleClear: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAction: (tool: Tool, options?: any) => void;
}

export function InputSection({
  activeTool,
  input,
  setInput,
  jsonPath,
  setJsonPath,
  handleCopy,
  copyInputSuccess,
  handleClear,
  handleFileUpload,
  onAction
}: InputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-end border-b border-ink/10 dark:border-whitex/10 pb-4">
        <h2 className="text-2xl font-serif font-bold text-ink dark:text-whitex flex items-center gap-3 transition-colors">
          <span className="text-orangex text-3xl">01</span> Input
        </h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleCopy(true)}
            className="text-greyx hover:text-ink dark:hover:text-whitex transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-wider"
          >
            {copyInputSuccess ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copyInputSuccess ? 'Copied' : 'Copy'}
          </button>
          <button 
            onClick={handleClear}
            className="text-greyx hover:text-ink dark:hover:text-whitex transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-wider"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>
      
      {activeTool === 'path' && (
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-[10px] text-greyx uppercase tracking-[0.2em] font-bold">JSON Path Query</label>
          <input 
            type="text" 
            value={jsonPath}
            onChange={(e) => setJsonPath(e.target.value)}
            placeholder="$.store.book[0]"
            className="bg-white dark:bg-card-dark border border-ink/10 dark:border-whitex/10 rounded-xl p-3 text-sm font-mono focus:border-orangex/50 outline-none shadow-sm text-ink dark:text-whitex transition-colors"
          />
        </div>
      )}

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON source here or drag and drop a file..."
          className="input-anthropic h-[500px] pr-12"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const content = event.target?.result as string;
                setInput(content);
              };
              reader.readAsText(file);
            }
          }}
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".json,.txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-white dark:bg-card-dark border border-ink/10 dark:border-whitex/10 text-greyx hover:text-orangex hover:border-orangex/30 shadow-sm transition-all group-hover:scale-105 active:scale-95"
            title="Upload JSON File"
          >
            <Upload size={18} />
          </button>
        </div>
        {!input && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-greyx/20 gap-4">
            <Upload size={48} className="opacity-20" />
            <p className="text-sm font-medium uppercase tracking-widest">Drop File Here</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-4 mt-2">
        {activeTool === 'formatter' && (
          <button onClick={() => onAction('formatter', { minify: false })} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <FileJson size={18} /> Prettify Source
          </button>
        )}
        {activeTool === 'minify' && (
          <button onClick={() => onAction('minify', { minify: true })} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <Minimize size={18} /> Minify JSON
          </button>
        )}
        {activeTool === 'validator' && (
          <button onClick={() => onAction('validator')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Run Validation
          </button>
        )}
        {activeTool === 'converter' && (
          <button onClick={() => onAction('converter')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <FileCode size={18} /> Export as YAML
          </button>
        )}
        {activeTool === 'schema' && (
          <button onClick={() => onAction('schema')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <Braces size={18} /> Infer JSON Schema
          </button>
        )}
        {activeTool === 'path' && (
          <button onClick={() => onAction('path')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <Compass size={18} /> Execute Query
          </button>
        )}
        {activeTool === 'repair' && (
          <button onClick={() => onAction('repair')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <Wrench size={18} /> Repair JSON
          </button>
        )}
        {activeTool === 'typescript' && (
          <button onClick={() => onAction('typescript')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <FileCode2 size={18} /> Generate TS Interfaces
          </button>
        )}
        {activeTool === 'csv' && (
          <button onClick={() => onAction('csv')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <Table size={18} /> Convert to CSV
          </button>
        )}
        {activeTool === 'sort' && (
          <button onClick={() => onAction('sort')} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
            <SortAsc size={18} /> Sort Keys
          </button>
        )}
        {activeTool === 'escape' && (
          <div className="flex gap-4 w-full">
            <button onClick={() => onAction('escape', { escape: true })} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
              <Quote size={18} /> Escape JSON
            </button>
            <button onClick={() => onAction('escape', { escape: false })} className="btn-anthropic-outline flex-1 flex items-center justify-center gap-2">
              <Quote size={18} /> Unescape JSON
            </button>
          </div>
        )}
        {activeTool === 'explorer' && (
          <button onClick={() => onAction('explorer')} className="btn-anthropic-accent flex-1">Refresh Data Tree</button>
        )}
      </div>
    </section>
  );
}
