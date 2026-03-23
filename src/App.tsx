/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  CheckCircle2, 
  FileJson, 
  ArrowRightLeft, 
  Search, 
  Copy, 
  Trash2, 
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Minimize2,
  FileCode,
  Braces,
  Compass,
  Moon,
  Sun,
  Upload,
  Download,
  Wrench,
  Table,
  SortAsc,
  Quote,
  FileCode2,
  Minimize
} from 'lucide-react';
import yaml from 'js-yaml';
import { jsonrepair } from 'jsonrepair';
import JsonToTS from 'json-to-ts';
import { json2csv } from 'json-2-csv';

type Tool = 'formatter' | 'validator' | 'converter' | 'explorer' | 'schema' | 'path' | 'repair' | 'typescript' | 'csv' | 'sort' | 'minify' | 'escape';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyInputSuccess, setCopyInputSuccess] = useState(false);
  const [jsonPath, setJsonPath] = useState('$');
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleFormat = useCallback((minify = false) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    try {
      if (!input.trim()) return;
      JSON.parse(input);
      setOutput('Valid JSON');
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleConvertToYAML = useCallback(() => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      setOutput(yaml.dump(json));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleGenerateSchema = useCallback(() => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      
      const generateSchema = (val: any): any => {
        const type = typeof val;
        if (val === null) return { type: 'null' };
        if (Array.isArray(val)) {
          return {
            type: 'array',
            items: val.length > 0 ? generateSchema(val[0]) : {}
          };
        }
        if (type === 'object') {
          const properties: any = {};
          Object.entries(val).forEach(([k, v]) => {
            properties[k] = generateSchema(v);
          });
          return { type: 'object', properties };
        }
        return { type };
      };

      setOutput(JSON.stringify(generateSchema(json), null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleJsonPath = useCallback(() => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      
      const query = (obj: any, path: string) => {
        if (path === '$') return obj;
        const parts = path.replace('$.', '').split('.');
        let current = obj;
        for (const part of parts) {
          if (part.includes('[') && part.includes(']')) {
            const [name, indexPart] = part.split('[');
            const index = parseInt(indexPart.replace(']', ''));
            current = current[name][index];
          } else {
            current = current[part];
          }
          if (current === undefined) return undefined;
        }
        return current;
      };

      const result = query(json, jsonPath);
      setOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, jsonPath]);

  const handleRepair = useCallback(() => {
    try {
      if (!input.trim()) return;
      const repaired = jsonrepair(input);
      setOutput(repaired);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleToTypeScript = useCallback(() => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      const interfaces = JsonToTS(json);
      setOutput(interfaces.join('\n\n'));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleToCSV = useCallback(async () => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      const csv = await json2csv(Array.isArray(json) ? json : [json]);
      setOutput(csv);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleSort = useCallback(() => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      
      const sortObject = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        return Object.keys(obj).sort().reduce((acc: any, key) => {
          acc[key] = sortObject(obj[key]);
          return acc;
        }, {});
      };

      setOutput(JSON.stringify(sortObject(json), null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleEscape = useCallback((escape = true) => {
    try {
      if (!input.trim()) return;
      if (escape) {
        setOutput(JSON.stringify(input));
      } else {
        setOutput(JSON.parse(input));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = (isInput = false) => {
    navigator.clipboard.writeText(isInput ? input : output);
    if (isInput) {
      setCopyInputSuccess(true);
      setTimeout(() => setCopyInputSuccess(false), 2000);
    } else {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-json-output-${activeTool}.${activeTool === 'csv' ? 'csv' : activeTool === 'converter' ? 'yaml' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div className="flex flex-col">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-ink dark:text-whitex leading-none transition-colors">Code Json</h1>
          <p className="text-greyx text-[12px] uppercase tracking-[0.4em] mt-4 font-semibold">Developer Suite \ {new Date().getFullYear()}</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {[
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
            ].map((tool) => (
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

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
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
              <button onClick={() => handleFormat(false)} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <FileJson size={18} /> Prettify Source
              </button>
            )}
            {activeTool === 'minify' && (
              <button onClick={() => handleFormat(true)} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <Minimize size={18} /> Minify JSON
              </button>
            )}
            {activeTool === 'validator' && (
              <button onClick={handleValidate} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Run Validation
              </button>
            )}
            {activeTool === 'converter' && (
              <button onClick={handleConvertToYAML} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <FileCode size={18} /> Export as YAML
              </button>
            )}
            {activeTool === 'schema' && (
              <button onClick={handleGenerateSchema} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <Braces size={18} /> Infer JSON Schema
              </button>
            )}
            {activeTool === 'path' && (
              <button onClick={handleJsonPath} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <Compass size={18} /> Execute Query
              </button>
            )}
            {activeTool === 'repair' && (
              <button onClick={handleRepair} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <Wrench size={18} /> Repair JSON
              </button>
            )}
            {activeTool === 'typescript' && (
              <button onClick={handleToTypeScript} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <FileCode2 size={18} /> Generate TS Interfaces
              </button>
            )}
            {activeTool === 'csv' && (
              <button onClick={handleToCSV} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <Table size={18} /> Convert to CSV
              </button>
            )}
            {activeTool === 'sort' && (
              <button onClick={handleSort} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                <SortAsc size={18} /> Sort Keys
              </button>
            )}
            {activeTool === 'escape' && (
              <div className="flex gap-4 w-full">
                <button onClick={() => handleEscape(true)} className="btn-anthropic-accent flex-1 flex items-center justify-center gap-2">
                  <Quote size={18} /> Escape JSON
                </button>
                <button onClick={() => handleEscape(false)} className="btn-anthropic-outline flex-1 flex items-center justify-center gap-2">
                  <Quote size={18} /> Unescape JSON
                </button>
              </div>
            )}
            {activeTool === 'explorer' && (
              <button onClick={() => setError(null)} className="btn-anthropic-accent flex-1">Refresh Data Tree</button>
            )}
          </div>
        </section>

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
      </main>

      <footer className="mt-24 py-16 w-full max-w-7xl border-t border-ink/5 dark:border-whitex/5 flex flex-col md:flex-row justify-between items-start gap-8 text-greyx text-[12px] font-medium">
        <div className="flex flex-col gap-2">
          <p className="text-ink dark:text-whitex font-bold tracking-tight text-lg font-serif transition-colors">Code Json</p>
          <p>© {new Date().getFullYear()} Nolan Stark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function JsonExplorer({ data }: { data: string }) {
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (data.trim()) {
        setParsed(JSON.parse(data));
        setError(null);
      } else {
        setParsed(null);
      }
    } catch (e: any) {
      setError(e.message);
      setParsed(null);
    }
  }, [data]);

  if (error) return <div className="text-red-400 text-sm font-mono">{error}</div>;
  if (!parsed) return <div className="text-greyx italic">Paste JSON to explore...</div>;

  return (
    <div className="font-mono text-sm">
      <JsonNode value={parsed} label="root" isLast />
    </div>
  );
}

interface JsonNodeProps {
  value: any;
  label: string;
  isLast: boolean;
  key?: string | number;
}

function JsonNode({ value, label, isLast }: JsonNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  if (!isObject) {
    return (
      <div className="ml-4 py-0.5">
        <span className="text-greyx">"{label}": </span>
        <span className={typeof value === 'string' ? 'text-orangex' : 'text-blue-400'}>
          {typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
        {!isLast && <span className="text-greyx">,</span>}
      </div>
    );
  }

  return (
    <div className="ml-4">
      <div 
        className="flex items-center gap-1 cursor-pointer hover:bg-ink/5 dark:hover:bg-whitex/5 py-0.5 rounded transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={14} className="text-orangex" /> : <ChevronRight size={14} className="text-orangex" />}
        <span className="text-greyx">"{label}": </span>
        <span className="text-ink dark:text-whitex transition-colors">{isArray ? '[' : '{'}</span>
        {!isOpen && <span className="text-greyx">...{isArray ? ']' : '}'}{!isLast && ','}</span>}
      </div>
      
      {isOpen && (
        <>
          <div>
            {Object.entries(value).map(([key, val], idx, arr) => (
              <JsonNode 
                key={key} 
                label={key} 
                value={val} 
                isLast={idx === arr.length - 1} 
              />
            ))}
          </div>
          <div className="ml-4 text-ink dark:text-whitex transition-colors">{isArray ? ']' : '}'}{!isLast && ','}</div>
        </>
      )}
    </div>
  );
}

