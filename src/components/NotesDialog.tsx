import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TestTube, Code, Search, Wrench, Palette, Sparkles, Database } from 'lucide-react';

export const NotesDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>setregex - User Guide</DialogTitle>
          <DialogDescription>
            Learn how to use all the features of this regex testing tool
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>1. Enter Pattern:</strong> Type your regex pattern in the Pattern field</p>
              <p><strong>2. Set Flags:</strong> Choose flags like 'g' (global), 'i' (ignore case), 'm' (multiline)</p>
              <p><strong>3. Add Test String:</strong> Enter the text you want to test against</p>
              <p><strong>4. View Results:</strong> See matches highlighted in real-time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Regex Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Describe What You Need:</strong> Tell the AI what pattern you want to match in plain English</p>
              <p><strong>Smart Generation:</strong> AI analyzes your description and test string to create accurate patterns</p>
              <p><strong>Instant Testing:</strong> Generated regex is automatically applied to your test string</p>
              <p><strong>Learn as You Go:</strong> See explanations of what each pattern does</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Query Formula Genie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Database Queries:</strong> Generate SQL queries for MySQL, PostgreSQL, SQL Server, Oracle</p>
              <p><strong>Spreadsheet Formulas:</strong> Create Excel and Google Sheets formulas</p>
              <p><strong>Regex & Substring:</strong> Choose between pattern matching or simple substring searches</p>
              <p><strong>Ready to Use:</strong> Copy generated queries/formulas directly to your database or spreadsheet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Results & Filtering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>All:</strong> Shows all matches found</p>
              <p><strong>Unique:</strong> Shows only unique matches (removes duplicates)</p>
              <p><strong>Groups:</strong> Shows only matches that contain capturing groups</p>
              <p><strong>Full:</strong> Shows matches that match the entire test string</p>
              <p><strong>Copy:</strong> Click copy buttons to copy matches or groups to clipboard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Multiple Languages:</strong> Generate code for JavaScript, Python, Java, C#, Go</p>
              <p><strong>Copy Code:</strong> One-click copy to clipboard</p>
              <p><strong>Ready to Use:</strong> Generated code includes pattern compilation and usage examples</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Replace & Split
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Replace:</strong> Test regex replacements with custom replacement strings</p>
              <p><strong>Split:</strong> Use regex as delimiter to split text into parts</p>
              <p><strong>Preview:</strong> See results before applying changes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Railroad Diagrams:</strong> Visual representation of regex patterns</p>
              <p><strong>Interactive:</strong> Explore pattern structure visually</p>
              <p><strong>Export:</strong> Save diagrams for documentation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save & Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Auto-save:</strong> Your work is automatically saved locally</p>
              <p><strong>Share Links:</strong> Generate compact shareable URLs (20-40 characters)</p>
              <p><strong>Import/Export:</strong> Save patterns as JSON or import from files</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};