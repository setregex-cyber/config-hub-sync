export interface RegexPattern {
  pattern: string;
  flags: string;
  testString: string;
  description?: string;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export interface SavedState {
  pattern: string;
  flags: string;
  testString: string;
  description?: string;
  timestamp: number;
}

export interface CodeGenLanguage {
  id: string;
  name: string;
  generate: (pattern: string, flags: string) => string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{ pattern: string; flags: string; testString: string }>;
}