import React from 'react';
import { validateRegex, executeRegex } from '../utils/regex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface AnalysisPluginProps {
  pattern: string;
  flags: string;
  testString: string;
}

export const AnalysisPlugin: React.FC<AnalysisPluginProps> = ({
  pattern,
  flags,
  testString
}) => {
  const isValid = validateRegex(pattern, flags);
  const matches = isValid ? executeRegex(pattern, flags, testString) : [];
  
  const analyzeComplexity = (pattern: string): string => {
    const features = [];
    if (pattern.includes('*') || pattern.includes('+') || pattern.includes('{')) {
      features.push('Quantifiers');
    }
    if (pattern.includes('(') && pattern.includes(')')) {
      features.push('Groups');
    }
    if (pattern.includes('[') && pattern.includes(']')) {
      features.push('Character Classes');
    }
    if (pattern.includes('\\')) {
      features.push('Escape Sequences');
    }
    if (pattern.includes('|')) {
      features.push('Alternation');
    }
    if (pattern.includes('^') || pattern.includes('$')) {
      features.push('Anchors');
    }
    
    if (features.length === 0) return 'Simple';
    if (features.length <= 2) return 'Moderate';
    if (features.length <= 4) return 'Complex';
    return 'Very Complex';
  };

  const complexity = analyzeComplexity(pattern);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Validity</span>
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Complexity</span>
            <Badge variant="secondary">{complexity}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Match Count</span>
            <Badge variant="outline">{matches.length}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pattern Length</span>
            <Badge variant="outline">{pattern.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Match Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="font-mono text-sm">"{match.match}"</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Position: {match.index} - {match.index + match.match.length}
                    {match.groups && match.groups.length > 0 && (
                      <div className="mt-1">
                        Groups: {match.groups.map((group, i) => (
                          <span key={i} className="inline-block mr-2">
                            {i + 1}: "{group}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};