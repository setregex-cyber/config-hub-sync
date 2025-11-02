import { CodeGenLanguage } from '../types/regex';

export const codeGenLanguages: CodeGenLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    generate: (pattern: string, flags: string) => {
      const flagsStr = flags ? `"${flags}"` : '';
      return `const regex = new RegExp("${pattern.replace(/"/g, '\\"')}"${flagsStr ? `, ${flagsStr}` : ''});
const matches = text.match(regex);
console.log(matches);`;
    }
  },
  {
    id: 'python',
    name: 'Python',
    generate: (pattern: string, flags: string) => {
      const flagsMap: Record<string, string> = {
        'i': 're.IGNORECASE',
        'm': 're.MULTILINE',
        's': 're.DOTALL',
        'x': 're.VERBOSE'
      };
      const pythonFlags = flags.split('').map(f => flagsMap[f]).filter(Boolean).join(' | ');
      const flagsStr = pythonFlags ? `, ${pythonFlags}` : '';
      
      return `import re

pattern = r"${pattern.replace(/\\/g, '\\\\')}"
regex = re.compile(pattern${flagsStr})
matches = regex.findall(text)
print(matches)`;
    }
  },
  {
    id: 'java',
    name: 'Java',
    generate: (pattern: string, flags: string) => {
      const hasIgnoreCase = flags.includes('i');
      const hasDotAll = flags.includes('s');
      const hasMultiline = flags.includes('m');
      
      let flagsStr = '';
      const javaFlags = [];
      if (hasIgnoreCase) javaFlags.push('Pattern.CASE_INSENSITIVE');
      if (hasDotAll) javaFlags.push('Pattern.DOTALL');
      if (hasMultiline) javaFlags.push('Pattern.MULTILINE');
      
      if (javaFlags.length > 0) {
        flagsStr = `, ${javaFlags.join(' | ')}`;
      }
      
      return `import java.util.regex.Pattern;
import java.util.regex.Matcher;

String text = "your text here";
Pattern pattern = Pattern.compile("${pattern.replace(/"/g, '\\"')}"${flagsStr});
Matcher matcher = pattern.matcher(text);

while (matcher.find()) {
    System.out.println(matcher.group());
}`;
    }
  },
  {
    id: 'csharp',
    name: 'C#',
    generate: (pattern: string, flags: string) => {
      const flagsMap: Record<string, string> = {
        'i': 'RegexOptions.IgnoreCase',
        'm': 'RegexOptions.Multiline',
        's': 'RegexOptions.Singleline',
        'x': 'RegexOptions.IgnorePatternWhitespace'
      };
      const csharpFlags = flags.split('').map(f => flagsMap[f]).filter(Boolean);
      const flagsStr = csharpFlags.length > 0 ? `, ${csharpFlags.join(' | ')}` : '';
      
      return `using System;
using System.Text.RegularExpressions;

string text = "your text here";
string pattern = @"${pattern.replace(/"/g, '""')}";
Regex regex = new Regex(pattern${flagsStr});

MatchCollection matches = regex.Matches(text);
foreach (Match match in matches)
{
    Console.WriteLine(match.Value);
}`;
    }
  },
  {
    id: 'go',
    name: 'Go',
    generate: (pattern: string, flags: string) => {
      const hasIgnoreCase = flags.includes('i');
      const hasMultiline = flags.includes('m');
      const hasDotAll = flags.includes('s');
      
      let modifiedPattern = pattern;
      if (hasIgnoreCase) modifiedPattern = `(?i)${modifiedPattern}`;
      if (hasMultiline) modifiedPattern = `(?m)${modifiedPattern}`;
      if (hasDotAll) modifiedPattern = `(?s)${modifiedPattern}`;
      
      return `package main

import (
    "fmt"
    "regexp"
)

func main() {
    text := "your text here"
    pattern := \`${modifiedPattern.replace(/`/g, '\\`')}\`
    
    regex, err := regexp.Compile(pattern)
    if err != nil {
        panic(err)
    }
    
    matches := regex.FindAllString(text, -1)
    fmt.Println(matches)
}`;
    }
  }
];

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};