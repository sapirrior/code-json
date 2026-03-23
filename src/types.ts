export type Tool = 'formatter' | 'validator' | 'converter' | 'explorer' | 'schema' | 'path' | 'repair' | 'typescript' | 'csv' | 'sort' | 'minify' | 'escape';

export interface JsonNodeProps {
  value: any;
  label: string;
  isLast: boolean;
  key?: string | number;
}
