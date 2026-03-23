import React, { useState, useEffect, useCallback } from 'react';
import { Tool } from './types';
import { 
  formatJson, 
  validateJson, 
  convertToYAML, 
  generateSchema, 
  queryJsonPath, 
  repairJson, 
  toTypeScript, 
  toCSV, 
  sortJson, 
  escapeJson 
} from './utils/jsonUtils';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyInputSuccess, setCopyInputSuccess] = useState(false);
  const [jsonPath, setJsonPath] = useState('$');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleAction = useCallback(async (tool: Tool, options?: any) => {
    try {
      if (!input.trim() && tool !== 'explorer') return;
      
      let result = '';
      switch (tool) {
        case 'formatter':
        case 'minify':
          result = formatJson(input, options?.minify);
          break;
        case 'validator':
          result = validateJson(input);
          break;
        case 'converter':
          result = convertToYAML(input);
          break;
        case 'schema':
          result = generateSchema(input);
          break;
        case 'path':
          result = queryJsonPath(input, jsonPath);
          break;
        case 'repair':
          result = repairJson(input);
          break;
        case 'typescript':
          result = toTypeScript(input);
          break;
        case 'csv':
          result = await toCSV(input);
          break;
        case 'sort':
          result = sortJson(input);
          break;
        case 'escape':
          result = escapeJson(input, options?.escape);
          break;
        case 'explorer':
          setError(null);
          return;
        default:
          break;
      }
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, jsonPath]);

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
      <Header 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        setError={setError} 
        setOutput={setOutput} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        <InputSection 
          activeTool={activeTool}
          input={input}
          setInput={setInput}
          jsonPath={jsonPath}
          setJsonPath={setJsonPath}
          handleCopy={handleCopy}
          copyInputSuccess={copyInputSuccess}
          handleClear={handleClear}
          handleFileUpload={handleFileUpload}
          onAction={handleAction}
        />

        <OutputSection 
          activeTool={activeTool}
          output={output}
          error={error}
          handleDownload={handleDownload}
          handleCopy={handleCopy}
          copySuccess={copySuccess}
          input={input}
        />
      </main>

      <Footer />
    </div>
  );
}
