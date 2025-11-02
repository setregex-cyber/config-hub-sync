import React, { useState, useEffect } from 'react';
import { RegexInput } from '../components/RegexInput';
import { RegexResults } from '../components/RegexResults';
import { RegexReplace } from '../components/RegexReplace';
import { RegexToolbar } from '../components/RegexToolbar';
import { CodeGeneration } from '../components/CodeGeneration';
import { ASTRailroadPlaceholders } from '../components/ASTRailroadPlaceholders';
import { PluginSystem } from '../plugins/PluginSystem';
import { AnalysisPlugin } from '../plugins/AnalysisPlugin';
import { TopAdPlaceholder, SidebarAdPlaceholder, MiddleAdPlaceholder, BottomAdPlaceholder, FloatingAdPlaceholder, ContentAdPlaceholder, BannerAdPlaceholder } from '../components/AdPlaceholders';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotesDialog } from '../components/NotesDialog';
import { CheatSheetDialog } from '../components/CheatSheetDialog';
import { Logo } from '../components/Logo';
import { AIRegexGenerator } from '../components/AIRegexGenerator';
import { ContentBar } from '../components/ContentBar';
import { QueryFormulaGenie } from '../components/QueryFormulaGenie';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { autoSaveState, loadAutoSavedState, decodeStateFromHash } from '../utils/regex';
import { SavedState, Plugin } from '../types/regex';
import { TestTube, Code, Puzzle, Layers, Sparkles } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [description, setDescription] = useState('');

  // Plugin system with demo plugin
  const plugins: Plugin[] = [
    {
      id: 'analysis',
      name: 'Pattern Analysis',
      description: 'Analyze regex complexity and provide insights',
      component: AnalysisPlugin
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pattern || testString) {
        autoSaveState(pattern, flags, testString);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [pattern, flags, testString]);

  // Load from hash or auto-save on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const state = decodeStateFromHash(hash);
      if (state) {
        setPattern(state.pattern);
        setFlags(state.flags);
        setTestString(state.testString);
        setDescription(state.description || '');
        toast({
          title: "Loaded from link",
          description: "Regex state has been restored from the shared link"
        });
        return;
      }
    }

    // Fallback to auto-save
    const autoSaved = loadAutoSavedState();
    if (autoSaved) {
      setPattern(autoSaved.pattern);
      setFlags(autoSaved.flags);
      setTestString(autoSaved.testString);
      setDescription(autoSaved.description || '');
      toast({
        title: "Auto-restored",
        description: "Your previous session has been restored"
      });
    }
  }, [toast]);

  const handleLoad = (state: SavedState) => {
    setPattern(state.pattern);
    setFlags(state.flags);
    setTestString(state.testString);
    setDescription(state.description || '');
  };

  const handleClear = () => {
    setPattern('');
    setFlags('g');
    setTestString('');
    setDescription('');
    
    // Clear auto-save
    localStorage.removeItem('regex-palace-autosave');
    
    // Clear URL hash
    window.history.replaceState(null, '', window.location.pathname);
    
    toast({
      title: "Cleared",
      description: "All data has been cleared"
    });
  };

  const handleRegexGenerated = (regex: string, desc: string) => {
    setPattern(regex);
    setDescription(desc);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-2xl font-bold">setregex</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-4">
              Best AI Regex Tool Online. Instantly build, test, and debug regex patterns with AI insights and multi-language support.
            </p>
            <div className="flex justify-center">
              <RegexToolbar
                pattern={pattern}
                flags={flags}
                testString={testString}
                description={description}
                onLoad={handleLoad}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Section */}
            <div className="glass-card p-6">
              <RegexInput
              pattern={pattern}
              flags={flags}
              testString={testString}
              description={description}
              onPatternChange={setPattern}
              onFlagsChange={setFlags}
              onTestStringChange={setTestString}
              onDescriptionChange={setDescription}
            />
            </div>

            {/* Results and Tools */}
            <div className="glass-card p-6">
              <Tabs defaultValue="results" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="replace" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Replace
                </TabsTrigger>
                <TabsTrigger value="codegen" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Gen
                </TabsTrigger>
                <TabsTrigger value="query-genie" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Query Genie
                </TabsTrigger>
                <TabsTrigger value="visualize" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Visualize
                </TabsTrigger>
                <TabsTrigger value="plugins" className="flex items-center gap-2">
                  <Puzzle className="h-4 w-4" />
                  Plugins
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {plugins.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                <RegexResults
                  pattern={pattern}
                  flags={flags}
                  testString={testString}
                />
              </TabsContent>

              <TabsContent value="replace" className="space-y-4">
                <RegexReplace
                  pattern={pattern}
                  flags={flags}
                  testString={testString}
                />
                <MiddleAdPlaceholder />
              </TabsContent>

              <TabsContent value="codegen" className="space-y-4">
                <CodeGeneration
                  pattern={pattern}
                  flags={flags}
                />
                <ContentAdPlaceholder />
              </TabsContent>

              <TabsContent value="query-genie" className="space-y-4">
                <QueryFormulaGenie />
              </TabsContent>

              <TabsContent value="visualize" className="space-y-4">
                <ASTRailroadPlaceholders
                  pattern={pattern}
                />
              </TabsContent>

              <TabsContent value="plugins" className="space-y-4">
                <PluginSystem
                  plugins={plugins}
                  pattern={pattern}
                  flags={flags}
                  testString={testString}
                />
              </TabsContent>
            </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <AIRegexGenerator onRegexGenerated={handleRegexGenerated} testString={testString} />
            </div>
            
            <SidebarAdPlaceholder />
            
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-primary">.</strong> - Matches any character except newline
                </div>
                <div>
                  <strong className="text-primary">*</strong> - 0 or more of the preceding element
                </div>
                <div>
                  <strong className="text-primary">+</strong> - 1 or more of the preceding element
                </div>
                <div>
                  <strong className="text-primary">?</strong> - 0 or 1 of the preceding element
                </div>
                <div>
                  <strong className="text-primary">[abc]</strong> - Character class (a, b, or c)
                </div>
                <div>
                  <strong className="text-primary">\d</strong> - Any digit (0-9)
                </div>
                <div>
                  <strong className="text-primary">\w</strong> - Any word character
                </div>
                <div>
                  <strong className="text-primary">\s</strong> - Any whitespace character
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NotesDialog />
                <CheatSheetDialog />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Bar */}
      <ContentBar />

      {/* Ad Slot Above Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="ad-placeholder h-24">
            <div className="text-sm font-medium">Ad Slot 1</div>
            <div className="text-xs text-muted-foreground mt-1">728x90 or responsive banner</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Logo />
                <h3 className="font-semibold text-lg">setregex</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                The Best AI Regex Tool Online. Query Genie lets you create, test, and debug regex patterns and formulas with AI-powered insights.
              </p>
              <p className="text-xs text-muted-foreground">
                © 2024 setregex. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Real-time Testing</li>
                <li>Code Generation</li>
                <li>Visual Diagrams</li>
                <li>Match Analysis</li>
                <li>Find & Replace</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Tools</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Pattern Validator</li>
                <li>String Splitter</li>
                <li>Cheat Sheet</li>
                <li>Import/Export</li>
                <li>Share Links</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Resources</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>How to Use</li>
                <li>Regex Guide</li>
                <li>Examples</li>
                <li>Best Practices</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            Built with React, TypeScript, and Tailwind CSS • 
            <span className="ml-1">Fast, reliable, and developer-friendly</span>
          </div>
        </div>
      </footer>
      
      {/* Floating Ad */}
      <FloatingAdPlaceholder />
    </div>
  );
};

export default Index;
