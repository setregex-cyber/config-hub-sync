import { RegexMatch, SavedState } from '../types/regex';
import LZString from 'lz-string';

export const validateRegex = (pattern: string, flags: string): boolean => {
  try {
    new RegExp(pattern, flags);
    return true;
  } catch {
    return false;
  }
};

export const executeRegex = (pattern: string, flags: string, testString: string): RegexMatch[] => {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    
    if (flags.includes('g')) {
      let match;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (match.index === regex.lastIndex) break;
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
      }
    }
    
    return matches;
  } catch {
    return [];
  }
};

export const saveToLocalStorage = (state: SavedState): void => {
  const saved = localStorage.getItem('regex-palace-saved') || '[]';
  const savedStates: SavedState[] = JSON.parse(saved);
  savedStates.unshift(state);
  
  // Keep only the latest 10 saves
  if (savedStates.length > 10) {
    savedStates.splice(10);
  }
  
  localStorage.setItem('regex-palace-saved', JSON.stringify(savedStates));
};

export const loadFromLocalStorage = (): SavedState[] => {
  try {
    const saved = localStorage.getItem('regex-palace-saved') || '[]';
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const autoSaveState = (pattern: string, flags: string, testString: string): void => {
  const state = {
    pattern,
    flags,
    testString,
    timestamp: Date.now()
  };
  localStorage.setItem('regex-palace-autosave', JSON.stringify(state));
};

export const loadAutoSavedState = (): SavedState | null => {
  try {
    const saved = localStorage.getItem('regex-palace-autosave');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const encodeStateToHash = (pattern: string, flags: string, testString: string): string => {
  const state = { pattern, flags, testString };
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
};

export const decodeStateFromHash = (hash: string): SavedState | null => {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(hash);
    if (!decompressed) return null;
    const state = JSON.parse(decompressed);
    return { ...state, timestamp: Date.now() };
  } catch {
    return null;
  }
};

export const exportState = (pattern: string, flags: string, testString: string, description?: string): string => {
  const state = {
    pattern,
    flags,
    testString,
    description,
    timestamp: Date.now(),
    version: '1.0'
  };
  return JSON.stringify(state, null, 2);
};

export const importState = (data: string): SavedState | null => {
  try {
    const parsed = JSON.parse(data);
    if (parsed.pattern !== undefined) {
      return {
        pattern: parsed.pattern || '',
        flags: parsed.flags || '',
        testString: parsed.testString || '',
        description: parsed.description,
        timestamp: parsed.timestamp || Date.now()
      };
    }
    // If it's not JSON, treat as raw test string
    return {
      pattern: '',
      flags: 'g',
      testString: data,
      timestamp: Date.now()
    };
  } catch {
    // If parsing fails, treat as raw test string
    return {
      pattern: '',
      flags: 'g',
      testString: data,
      timestamp: Date.now()
    };
  }
};
