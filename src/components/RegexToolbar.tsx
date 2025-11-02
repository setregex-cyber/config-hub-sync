import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Download, Share, RotateCcw, Copy, Link, Paperclip } from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage, exportState, importState, encodeStateToHash } from '../utils/regex';
import { SavedState } from '../types/regex';

interface RegexToolbarProps {
  pattern: string;
  flags: string;
  testString: string;
  description: string;
  onLoad: (state: SavedState) => void;
  onClear: () => void;
}

export const RegexToolbar: React.FC<RegexToolbarProps> = ({
  pattern,
  flags,
  testString,
  description,
  onLoad,
  onClear
}) => {
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedStates, setSavedStates] = useState<SavedState[]>([]);

  const handleSave = () => {
    if (!pattern) {
      toast({
        title: "Cannot save",
        description: "Please enter a regex pattern first",
        variant: "destructive"
      });
      return;
    }

    const state: SavedState = {
      pattern,
      flags,
      testString,
      description,
      timestamp: Date.now()
    };

    saveToLocalStorage(state);
    setSaveDialogOpen(false);
    
    toast({
      title: "Saved successfully",
      description: "Your regex has been saved to local storage"
    });
  };

  const handleLoad = () => {
    const states = loadFromLocalStorage();
    setSavedStates(states);
    setLoadDialogOpen(true);
  };

  const handleLoadState = (state: SavedState) => {
    onLoad(state);
    setLoadDialogOpen(false);
    
    toast({
      title: "Loaded successfully",
      description: "Regex state has been restored"
    });
  };

  const handleExport = () => {
    if (!pattern) {
      toast({
        title: "Cannot export",
        description: "Please enter a regex pattern first",
        variant: "destructive"
      });
      return;
    }

    const exportData = exportState(pattern, flags, testString, description);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regex-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported successfully",
      description: "Regex data has been downloaded as JSON"
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const state = importState(content);
      if (state) {
        onLoad(state);
        setImportDialogOpen(false);
        toast({
          title: "File imported successfully",
          description: `Loaded data from ${file.name}`
        });
      } else {
        toast({
          title: "Import failed",
          description: "Unable to parse the file content",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Cannot import",
        description: "Please paste data to import or select a file",
        variant: "destructive"
      });
      return;
    }

    const state = importState(importData);
    if (state) {
      onLoad(state);
      setImportDialogOpen(false);
      setImportData('');
      
      toast({
        title: "Imported successfully",
        description: "Data has been loaded into the editor"
      });
    } else {
      toast({
        title: "Import failed",
        description: "Unable to parse the imported data",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (!pattern) {
      toast({
        title: "Cannot share",
        description: "Please enter a regex pattern first",
        variant: "destructive"
      });
      return;
    }

    const hash = encodeStateToHash(pattern, flags, testString);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Shareable link has been copied to clipboard"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive"
      });
    });
    
    setShareDialogOpen(false);
  };

  const getCurrentUrl = () => {
    const hash = encodeStateToHash(pattern, flags, testString);
    return `${window.location.origin}${window.location.pathname}#${hash}`;
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      toast({
        title: "Link copied!",
        description: "Current state link copied to clipboard"
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Regex</DialogTitle>
            <DialogDescription>
              Save your current regex pattern and test data to local storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleLoad}>
            <Upload className="h-4 w-4 mr-2" />
            Load
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load Saved Regex</DialogTitle>
            <DialogDescription>
              Select a previously saved regex to load.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {savedStates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved regex patterns found
              </div>
            ) : (
              savedStates.map((state, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent" onClick={() => handleLoadState(state)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">{state.pattern || 'Empty pattern'}</CardTitle>
                    <CardDescription className="text-xs">
                      {state.description || 'No description'} • {new Date(state.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      Flags: {state.flags || 'none'} • Test: {state.testString.slice(0, 50)}...
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Paste JSON data to import, or raw text to use as test string.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileImport}
                accept=".json,.txt,.regex"
                className="hidden"
              />
              <span className="text-sm text-muted-foreground self-center">or paste data below</span>
            </div>
            <div>
              <Label htmlFor="import-data">Data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON export or raw text here..."
                rows={6}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Regex</DialogTitle>
            <DialogDescription>
              Copy the link below to share your regex with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-url">Shareable URL</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={getCurrentUrl()}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button size="sm" onClick={copyCurrentUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleShare}>
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear your current regex pattern, flags, test string, and description. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClear}>
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};