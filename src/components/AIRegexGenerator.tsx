import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIRegexGeneratorProps {
  onRegexGenerated: (pattern: string, description: string) => void;
  testString: string;
}

export const AIRegexGenerator = ({ onRegexGenerated, testString }: AIRegexGeneratorProps) => {
  const [request, setRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!request.trim()) {
      toast({
        title: "Error",
        description: "Please describe what you want to match",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-regex', {
        body: { userRequest: request, testString }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.regex && data.description) {
        onRegexGenerated(data.regex, data.description);
        toast({
          title: "Regex Generated!",
          description: data.description
        });
        setRequest('');
      } else {
        throw new Error('Invalid response format from AI');
      }

    } catch (error) {
      console.error('Error generating regex:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate regex pattern",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Regex Generator
        </CardTitle>
        <CardDescription>
          Describe what you want to match and let AI generate the regex pattern for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Example: Find all email addresses in the text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="min-h-[100px]"
          disabled={isGenerating}
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Regex
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
