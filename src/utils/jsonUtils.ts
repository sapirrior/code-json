import yaml from 'js-yaml';
import { jsonrepair } from 'jsonrepair';
import JsonToTS from 'json-to-ts';
import { json2csv } from 'json-2-csv';

export const formatJson = (input: string, minify = false) => {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, minify ? 0 : 2);
};

export const validateJson = (input: string) => {
  JSON.parse(input);
  return 'Valid JSON';
};

export const convertToYAML = (input: string) => {
  const json = JSON.parse(input);
  return yaml.dump(json);
};

export const generateSchema = (input: string) => {
  const json = JSON.parse(input);
  
  const generate = (val: any): any => {
    const type = typeof val;
    if (val === null) return { type: 'null' };
    if (Array.isArray(val)) {
      return {
        type: 'array',
        items: val.length > 0 ? generate(val[0]) : {}
      };
    }
    if (type === 'object') {
      const properties: any = {};
      Object.entries(val).forEach(([k, v]) => {
        properties[k] = generate(v);
      });
      return { type: 'object', properties };
    }
    return { type };
  };

  return JSON.stringify(generate(json), null, 2);
};

export const queryJsonPath = (input: string, jsonPath: string) => {
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
  return JSON.stringify(result, null, 2);
};

export const repairJson = (input: string) => {
  return jsonrepair(input);
};

export const toTypeScript = (input: string) => {
  const json = JSON.parse(input);
  const interfaces = JsonToTS(json);
  return interfaces.join('\n\n');
};

export const toCSV = async (input: string) => {
  const json = JSON.parse(input);
  return await json2csv(Array.isArray(json) ? json : [json]);
};

export const sortJson = (input: string) => {
  const json = JSON.parse(input);
  
  const sortObject = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj).sort().reduce((acc: any, key) => {
      acc[key] = sortObject(obj[key]);
      return acc;
    }, {});
  };

  return JSON.stringify(sortObject(json), null, 2);
};

export const escapeJson = (input: string, escape = true) => {
  if (escape) {
    return JSON.stringify(input);
  } else {
    return JSON.parse(input);
  }
};
