import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { validateRegex } from '../utils/regex';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RegexInputProps {
  pattern: string;
  flags: string;
  testString: string;
  description: string;
  onPatternChange: (value: string) => void;
  onFlagsChange: (flags: string) => void;
  onTestStringChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const RegexInput: React.FC<RegexInputProps> = ({
  pattern,
  flags,
  testString,
  description,
  onPatternChange,
  onFlagsChange,
  onTestStringChange,
  onDescriptionChange
}) => {
  const isValid = validateRegex(pattern, flags);
  
  const handleFlagChange = (flag: string, checked: boolean) => {
    if (checked) {
      onFlagsChange(flags + flag);
    } else {
      onFlagsChange(flags.replace(flag, ''));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Regular Expression
          {pattern && (
            isValid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pattern">Pattern</Label>
          <Input
            id="pattern"
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="Enter your regex pattern..."
            className={`font-mono ${!isValid && pattern ? 'border-destructive' : ''}`}
            aria-describedby="pattern-status"
          />
          <div id="pattern-status" className="sr-only">
            {pattern ? (isValid ? 'Valid regex pattern' : 'Invalid regex pattern') : 'No pattern entered'}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Flags</Label>
          <div className="flex flex-wrap gap-4">
            {[
              { flag: 'g', label: 'Global (g)', desc: 'Find all matches' },
              { flag: 'i', label: 'Ignore Case (i)', desc: 'Case insensitive' },
              { flag: 'm', label: 'Multiline (m)', desc: '^$ match line breaks' },
              { flag: 's', label: 'Dot All (s)', desc: '. matches newlines' },
              { flag: 'u', label: 'Unicode (u)', desc: 'Unicode support' },
              { flag: 'y', label: 'Sticky (y)', desc: 'Match at lastIndex' }
            ].map(({ flag, label, desc }) => (
              <div key={flag} className="flex items-center space-x-2">
                <Checkbox
                  id={`flag-${flag}`}
                  checked={flags.includes(flag)}
                  onCheckedChange={(checked) => handleFlagChange(flag, checked as boolean)}
                  aria-describedby={`flag-${flag}-desc`}
                />
                <Label 
                  htmlFor={`flag-${flag}`} 
                  className="text-sm cursor-pointer"
                  title={desc}
                >
                  {label}
                </Label>
                <span id={`flag-${flag}-desc`} className="sr-only">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what this regex does..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-string">Test String</Label>
          <Textarea
            id="test-string"
            value={testString}
            onChange={(e) => onTestStringChange(e.target.value)}
            placeholder="Enter text to test against your regex..."
            className="font-mono min-h-[100px]"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};