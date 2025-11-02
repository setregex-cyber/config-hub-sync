import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Check } from 'lucide-react';
import { codeGenLanguages, copyToClipboard } from '../utils/codegen';

interface CodeGenerationProps {
  pattern: string;
  flags: string;
}

export const CodeGeneration: React.FC<CodeGenerationProps> = ({ pattern, flags }) => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const currentLanguage = codeGenLanguages.find(lang => lang.id === selectedLanguage);
  const generatedCode = currentLanguage ? currentLanguage.generate(pattern, flags) : '';

  const handleCopy = async (code: string, languageId: string) => {
    const success = await copyToClipboard(code);
    
    if (success) {
      setCopiedStates({ ...copiedStates, [languageId]: true });
      toast({
        title: "Copied!",
        description: `${currentLanguage?.name} code copied to clipboard`
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [languageId]: false }));
      }, 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleCopyAll = async () => {
    const allCode = codeGenLanguages
      .map(lang => `// ${lang.name}\n${lang.generate(pattern, flags)}\n`)
      .join('\n' + '='.repeat(50) + '\n\n');
    
    const success = await copyToClipboard(allCode);
    
    if (success) {
      toast({
        title: "All code copied!",
        description: "Code for all languages copied to clipboard"
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  if (!pattern) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Enter a regex pattern to generate code
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Code Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {codeGenLanguages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="ml-2">
              {currentLanguage?.name}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(generatedCode, selectedLanguage)}
              disabled={!generatedCode}
            >
              {copiedStates[selectedLanguage] ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copiedStates[selectedLanguage] ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyAll}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
        </div>

        {generatedCode && (
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-javascript">{generatedCode}</code>
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {codeGenLanguages.map((lang) => (
            <Button
              key={lang.id}
              size="sm"
              variant={selectedLanguage === lang.id ? "default" : "outline"}
              onClick={() => setSelectedLanguage(lang.id)}
              className="text-xs"
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};