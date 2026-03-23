import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { JsonNodeProps } from '../types';

export function JsonExplorer({ data }: { data: string }) {
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
