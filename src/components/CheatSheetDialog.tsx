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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export const CheatSheetDialog: React.FC = () => {
  const sections = [
    {
      title: "Basic Patterns",
      items: [
        { pattern: ".", description: "Any character except newline" },
        { pattern: "\\d", description: "Any digit (0-9)" },
        { pattern: "\\D", description: "Any non-digit" },
        { pattern: "\\w", description: "Any word character (a-z, A-Z, 0-9, _)" },
        { pattern: "\\W", description: "Any non-word character" },
        { pattern: "\\s", description: "Any whitespace character (space, tab, newline)" },
        { pattern: "\\S", description: "Any non-whitespace character" },
        { pattern: "\\t", description: "Tab character" },
        { pattern: "\\n", description: "Newline character" },
        { pattern: "\\r", description: "Carriage return" },
        { pattern: "\\f", description: "Form feed" },
        { pattern: "\\v", description: "Vertical tab" },
      ]
    },
    {
      title: "Quantifiers",
      items: [
        { pattern: "*", description: "0 or more (greedy)" },
        { pattern: "*?", description: "0 or more (lazy/non-greedy)" },
        { pattern: "+", description: "1 or more (greedy)" },
        { pattern: "+?", description: "1 or more (lazy/non-greedy)" },
        { pattern: "?", description: "0 or 1 (greedy)" },
        { pattern: "??", description: "0 or 1 (lazy/non-greedy)" },
        { pattern: "{n}", description: "Exactly n occurrences" },
        { pattern: "{n,}", description: "n or more occurrences" },
        { pattern: "{n,}?", description: "n or more (lazy)" },
        { pattern: "{n,m}", description: "Between n and m occurrences" },
        { pattern: "{n,m}?", description: "Between n and m (lazy)" },
      ]
    },
    {
      title: "Character Classes",
      items: [
        { pattern: "[abc]", description: "Any one of a, b, or c" },
        { pattern: "[^abc]", description: "Any character except a, b, or c" },
        { pattern: "[a-z]", description: "Any lowercase letter" },
        { pattern: "[A-Z]", description: "Any uppercase letter" },
        { pattern: "[0-9]", description: "Any digit" },
        { pattern: "[a-zA-Z0-9]", description: "Any alphanumeric character" },
        { pattern: "[\\w\\s]", description: "Any word character or whitespace" },
        { pattern: "[^\\d]", description: "Any non-digit (same as \\D)" },
        { pattern: "[:alnum:]", description: "Alphanumeric characters" },
        { pattern: "[:alpha:]", description: "Alphabetic characters" },
        { pattern: "[:blank:]", description: "Space and tab" },
        { pattern: "[:digit:]", description: "Decimal digits" },
      ]
    },
    {
      title: "Anchors & Boundaries",
      items: [
        { pattern: "^", description: "Start of string/line" },
        { pattern: "$", description: "End of string/line" },
        { pattern: "\\b", description: "Word boundary" },
        { pattern: "\\B", description: "Non-word boundary" },
        { pattern: "\\A", description: "Start of string only" },
        { pattern: "\\Z", description: "End of string only" },
        { pattern: "\\z", description: "Very end of string" },
        { pattern: "\\G", description: "End of previous match" },
      ]
    },
    {
      title: "Advanced Groups",
      items: [
        { pattern: "(abc)", description: "Capturing group #1" },
        { pattern: "(?:abc)", description: "Non-capturing group" },
        { pattern: "(?<name>abc)", description: "Named capturing group" },
        { pattern: "(?P<name>abc)", description: "Python-style named group" },
        { pattern: "(?>abc)", description: "Atomic group (no backtracking)" },
        { pattern: "(?|abc|def)", description: "Branch reset group" },
        { pattern: "\\1", description: "Backreference to group 1" },
        { pattern: "\\k<name>", description: "Named backreference" },
        { pattern: "(?R)", description: "Recursion of entire pattern" },
        { pattern: "(?1)", description: "Recursion of group 1" },
      ]
    },
    {
      title: "Lookaround Assertions",
      items: [
        { pattern: "(?=abc)", description: "Positive lookahead" },
        { pattern: "(?!abc)", description: "Negative lookahead" },
        { pattern: "(?<=abc)", description: "Positive lookbehind" },
        { pattern: "(?<!abc)", description: "Negative lookbehind" },
        { pattern: "\\K", description: "Keep everything before this point" },
        { pattern: "x(?=y)", description: "x followed by y" },
        { pattern: "x(?!y)", description: "x not followed by y" },
        { pattern: "(?<=y)x", description: "x preceded by y" },
        { pattern: "(?<!y)x", description: "x not preceded by y" },
      ]
    },
    {
      title: "Unicode & Encoding",
      items: [
        { pattern: "\\x{1F600}", description: "Unicode code point (hex)" },
        { pattern: "\\u{1F600}", description: "Unicode code point (JS)" },
        { pattern: "\\uXXXX", description: "Unicode 16-bit hex" },
        { pattern: "\\U00XXXXXX", description: "Unicode 32-bit hex" },
        { pattern: "\\p{L}", description: "Any Unicode letter" },
        { pattern: "\\p{N}", description: "Any Unicode number" },
        { pattern: "\\p{Script=Latin}", description: "Latin script characters" },
        { pattern: "\\p{Block=Basic_Latin}", description: "Basic Latin block" },
        { pattern: "\\P{L}", description: "Not a Unicode letter" },
      ]
    },
    {
      title: "Conditional & Subroutines",
      items: [
        { pattern: "(?(?=test)yes|no)", description: "Conditional: if lookahead matches" },
        { pattern: "(?(1)yes|no)", description: "Conditional: if group 1 exists" },
        { pattern: "(?(<name>)yes|no)", description: "Conditional: if named group exists" },
        { pattern: "(?R)", description: "Recursive entire pattern" },
        { pattern: "(?1)", description: "Call subpattern 1" },
        { pattern: "(?&name)", description: "Call named subpattern" },
        { pattern: "(?C)", description: "Callout to external function" },
        { pattern: "(*FAIL)", description: "Force backtrack/fail" },
        { pattern: "(*PRUNE)", description: "Prevent backtracking" },
        { pattern: "(*SKIP)", description: "Skip to next start position" },
      ]
    },
    {
      title: "PCRE Control Verbs",
      items: [
        { pattern: "(*ACCEPT)", description: "Force match success" },
        { pattern: "(*COMMIT)", description: "Prevent backtracking past this point" },
        { pattern: "(*FAIL)", description: "Force match failure" },
        { pattern: "(*MARK:name)", description: "Set named mark" },
        { pattern: "(*PRUNE:name)", description: "Prune backtracking to mark" },
        { pattern: "(*SKIP:name)", description: "Skip to named mark" },
        { pattern: "(*THEN)", description: "Force local failure" },
        { pattern: "(*UTF)", description: "Set UTF mode" },
        { pattern: "(*UCP)", description: "Use Unicode properties" },
        { pattern: "(*CR)", description: "Set newline convention" },
      ]
    },
    {
      title: "Advanced Flags & Modifiers",
      items: [
        { pattern: "(?i)", description: "Case insensitive mode" },
        { pattern: "(?-i)", description: "Case sensitive mode" },
        { pattern: "(?m)", description: "Multiline mode" },
        { pattern: "(?s)", description: "Dotall mode (. matches newlines)" },
        { pattern: "(?x)", description: "Extended mode (ignore whitespace)" },
        { pattern: "(?J)", description: "Allow duplicate named groups" },
        { pattern: "(?U)", description: "Default ungreedy quantifiers" },
        { pattern: "(?X)", description: "Extra features" },
        { pattern: "(?-imsx)", description: "Turn off specified modes" },
        { pattern: "(?imsx:pattern)", description: "Apply modes to specific pattern" },
      ]
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Cheat Sheet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Regex Cheat Sheet</DialogTitle>
          <DialogDescription>
            Quick reference for regular expression patterns and syntax
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <div className="font-mono text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.pattern}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};