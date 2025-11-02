import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { executeRegex, validateRegex } from '../utils/regex';
import { Target, AlertCircle, Filter, Copy } from 'lucide-react';

interface RegexResultsProps {
  pattern: string;
  flags: string;
  testString: string;
}

export const RegexResults: React.FC<RegexResultsProps> = ({
  pattern,
  flags,
  testString
}) => {
  const { toast } = useToast();
  const isValid = validateRegex(pattern, flags);
  const matches = isValid ? executeRegex(pattern, flags, testString) : [];
  const [filter, setFilter] = useState<'all' | 'unique' | 'groups'>('all');
  const [selectedGroup, setSelectedGroup] = useState<number>(1);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const highlightMatches = (text: string): React.ReactNode => {
    if (!isValid || matches.length === 0) {
      return text;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort matches by index to handle overlapping matches
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, matchIndex) => {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the highlighted match
      parts.push(
        <span key={`match-${matchIndex}`} className="regex-match font-semibold">
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const getFilteredMatches = () => {
    switch (filter) {
      case 'unique':
        return matches.filter((match, index, arr) => 
          arr.findIndex(m => m.match === match.match) === index
        );
      case 'groups':
        return matches.filter(match => match.groups && match.groups.length >= selectedGroup);
      default:
        return matches;
    }
  };

  const getMaxGroups = () => {
    return Math.max(0, ...matches.map(match => match.groups?.length || 0));
  };

  const copyAllResults = async () => {
    const resultsText = filteredMatches.map((match) => {
      if (filter === 'unique') {
        return `"${match.match}"`;
      } else if (filter === 'groups') {
        if (match.groups && match.groups[selectedGroup - 1]) {
          return `"${match.groups[selectedGroup - 1]}"`;
        }
        return '';
      } else {
        // All filter format
        const groups = match.groups?.map((group) => `"${group}"`).join('\n') || '';
        return `"${match.match}"\n\nPosition: ${match.index} - ${match.index + match.match.length}\nGroups:\n\n${groups}`;
      }
    }).filter(text => text).join('\n');

    try {
      await navigator.clipboard.writeText(resultsText);
      toast({
        title: "Copied!",
        description: "All filtered results copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Results
            <Badge variant="outline" className="ml-auto">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pattern && (
            <div className="text-center py-8 text-muted-foreground">
              Enter a regex pattern to see results
            </div>
          )}

          {pattern && !isValid && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-destructive">Invalid regex pattern</span>
            </div>
          )}

          {pattern && isValid && (
            <div 
              className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-words min-h-[200px]"
              aria-live="polite"
              aria-label={`Test string with ${matches.length} matches highlighted`}
            >
              {highlightMatches(testString)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Details Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Match Details
            <Badge variant="outline" className="ml-auto">
              {filteredMatches.length} shown
            </Badge>
          </CardTitle>
          {matches.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                {(['all', 'unique', 'groups'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className="text-xs"
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </Button>
                ))}
                {filter === 'groups' && getMaxGroups() > 0 && (
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
                    className="ml-2 text-xs px-2 py-1 border rounded"
                  >
                    {Array.from({ length: getMaxGroups() }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Group {i + 1}</option>
                    ))}
                  </select>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllResults}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!pattern && (
            <div className="text-center py-8 text-muted-foreground">
              Enter a regex pattern to see match details
            </div>
          )}

          {pattern && !isValid && (
            <div className="text-center py-8 text-muted-foreground">
              Fix regex pattern to see match details
            </div>
          )}

          {pattern && isValid && filteredMatches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {matches.length === 0 ? 'No matches found' : 'No matches for current filter'}
            </div>
          )}

          {pattern && isValid && filteredMatches.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredMatches.map((match, index) => (
                  <div key={index} className="p-3 bg-card border rounded-lg">
                    {filter === 'unique' ? (
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm font-medium">
                          "{match.match}"
                        </div>
                      </div>
                    ) : filter === 'groups' ? (
                      <div>
                        {match.groups && match.groups[selectedGroup - 1] ? (
                          <div className="font-mono text-sm">
                            "{match.groups[selectedGroup - 1]}"
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="font-mono text-sm font-medium">
                            "{match.match}"
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Position: {match.index} - {match.index + match.match.length}
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Groups:</span>
                          </div>
                          {match.groups && match.groups.length > 0 ? (
                            match.groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="text-xs">
                                <span className="font-medium">{groupIndex + 1}:</span>{' '}
                                <span className="font-mono">"{group}"</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-muted-foreground ml-2">No groups</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};