import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Replace, Split } from 'lucide-react';
import { validateRegex } from '../utils/regex';
import { useToast } from '@/hooks/use-toast';

interface RegexReplaceProps {
  pattern: string;
  flags: string;
  testString: string;
}

export const RegexReplace: React.FC<RegexReplaceProps> = ({
  pattern,
  flags,
  testString
}) => {
  const { toast } = useToast();
  const [replaceValue, setReplaceValue] = useState('');
  const [replaceResult, setReplaceResult] = useState('');
  const [splitResult, setSplitResult] = useState<string[]>([]);
  
  const isValid = validateRegex(pattern, flags);

  const handleReplace = () => {
    if (!pattern || !isValid) return;
    
    try {
      const regex = new RegExp(pattern, flags);
      const result = testString.replace(regex, replaceValue);
      setReplaceResult(result);
    } catch {
      // Handle error
    }
  };

  const handleSplit = () => {
    if (!pattern || !isValid) return;
    
    try {
      const regex = new RegExp(pattern, flags);
      const result = testString.split(regex);
      setSplitResult(result);
    } catch {
      // Handle error
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Text copied to clipboard"
      });
    });
  };

  if (!pattern) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Replace className="h-5 w-5" />
            Replace & Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Enter a regex pattern to use replace and split functions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Replace className="h-5 w-5" />
          Replace & Split
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Replace Section */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="replace-value">Replace with:</Label>
            <div className="flex gap-2">
              <Input
                id="replace-value"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                placeholder="Replacement text (use $1, $2 for groups)"
                className="font-mono"
              />
              <Button 
                onClick={handleReplace} 
                disabled={!isValid}
                size="sm"
              >
                Replace
              </Button>
            </div>
          </div>
          
          {replaceResult && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Replace Result:</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(replaceResult)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={replaceResult}
                readOnly
                className="font-mono text-sm bg-muted"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Split Section */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label>Split by Pattern:</Label>
            <Button 
              onClick={handleSplit} 
              disabled={!isValid}
              size="sm"
            >
              <Split className="h-4 w-4 mr-2" />
              Split
            </Button>
          </div>
          
          {splitResult.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Split Result ({splitResult.length} parts):</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(splitResult.join('\n'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {splitResult.map((part, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm font-mono border">
                    <span className="text-xs text-muted-foreground">Part {index + 1}: </span>
                    <span className="break-words">{part || '(empty)'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};