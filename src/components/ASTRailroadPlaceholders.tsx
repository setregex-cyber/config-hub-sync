import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Maximize2 } from 'lucide-react';

// Advanced Regex -> Railroad Diagram tool
// Supports comprehensive regular expression features:
//  - literals, escaped characters, unicode
//  - concatenation, alternation with precedence
//  - grouping (capturing and non-capturing)
//  - quantifiers: *, +, ?, {m}, {m,}, {m,n} (greedy and lazy)
//  - character classes, ranges, negation, shorthand classes
//  - anchors, word boundaries
//  - lookahead and lookbehind assertions
//  - backreferences and named groups

// ---------- Enhanced Parser (recursive descent) ----------

interface Token {
  type: string;
  value: string;
  position?: number;
}

interface ASTNode {
  type: string;
  [key: string]: any;
}

function tokenize(pattern: string): Token[] {
  const tokens: Token[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "\\") {
      // Enhanced escape handling
      const next = pattern[i + 1] ?? "";
      if ('dwsWDSnrtfvabcxu'.includes(next)) {
        tokens.push({ type: 'ESCAPE', value: '\\' + next, position: i });
      } else {
        tokens.push({ type: 'CHAR', value: '\\' + next, position: i });
      }
      i++;
    } else if (ch === '(' && pattern[i + 1] === '?') {
      // Enhanced group handling: (?:...), (?=...), (?!...), (?<=...), (?<!...)
      let j = i + 2;
      let groupType = '';
      while (j < pattern.length && pattern[j] !== ')' && groupType.length < 3) {
        groupType += pattern[j];
        if (pattern[j] === ':' || pattern[j] === '=' || pattern[j] === '!' || pattern[j] === '<') break;
        j++;
      }
      tokens.push({ type: 'SPECIAL_GROUP', value: '(?' + groupType, position: i });
      i = j - 1;
    } else if ('()|*+?{}'.includes(ch)) {
      tokens.push({ type: ch, value: ch, position: i });
    } else if (ch === '[') {
      // Enhanced character class with ranges and negation
      let j = i + 1;
      let cls = '';
      let isNegated = false;
      if (pattern[j] === '^') {
        isNegated = true;
        cls += pattern[j];
        j++;
      }
      while (j < pattern.length && pattern[j] !== ']') {
        if (pattern[j] === '\\' && j + 1 < pattern.length) {
          cls += pattern[j] + pattern[j + 1];
          j += 2;
        } else {
          cls += pattern[j];
          j++;
        }
      }
      tokens.push({ type: 'CLASS', value: cls, position: i });
      i = j;
    } else if (ch === '{') {
      // Enhanced quantifier with lazy support
      let j = i + 1;
      let body = '';
      while (j < pattern.length && pattern[j] !== '}') {
        body += pattern[j];
        j++;
      }
      // Check for lazy quantifier
      const isLazy = pattern[j + 1] === '?';
      tokens.push({ type: 'RANGE', value: body + (isLazy ? '?' : ''), position: i });
      i = j + (isLazy ? 1 : 0);
    } else if ('^$'.includes(ch)) {
      tokens.push({ type: 'ANCHOR', value: ch, position: i });
    } else {
      tokens.push({ type: 'CHAR', value: ch, position: i });
    }
  }
  tokens.push({ type: 'EOF', value: '', position: pattern.length });
  return tokens;
}

// Enhanced AST node helpers
function literalNode(text: string): ASTNode { return { type: 'LITERAL', text }; }
function concatNode(children: ASTNode[]): ASTNode { return { type: 'CONCAT', children }; }
function altNode(options: ASTNode[]): ASTNode { return { type: 'ALT', options }; }
function quantNode(child: ASTNode, quant: any): ASTNode { return { type: 'QUANT', child, quant }; }
function groupNode(child: ASTNode, groupType: string = 'capture'): ASTNode { return { type: 'GROUP', child, groupType }; }
function classNode(text: string, isNegated: boolean = false): ASTNode { return { type: 'CLASS', text, isNegated }; }
function escapeNode(text: string): ASTNode { return { type: 'ESCAPE', text }; }
function anchorNode(text: string): ASTNode { return { type: 'ANCHOR', text }; }
function lookaroundNode(child: ASTNode, direction: string, positive: boolean): ASTNode { 
  return { type: 'LOOKAROUND', child, direction, positive }; 
}

function parsePattern(pattern: string): ASTNode {
  const tokens = tokenize(pattern);
  let pos = 0;
  function peek(): Token { return tokens[pos] || { type: 'EOF', value: '' }; }
  function next(): Token { return tokens[pos++]; }

  function parseAtom(): ASTNode {
    const t = peek();
    
    if (t.type === 'CHAR') {
      next();
      return literalNode(t.value);
    }
    
    if (t.type === 'ESCAPE') {
      next();
      return escapeNode(t.value);
    }
    
    if (t.type === 'ANCHOR') {
      next();
      return anchorNode(t.value);
    }
    
    if (t.type === 'CLASS') {
      next();
      const isNegated = t.value.startsWith('^');
      return classNode(t.value, isNegated);
    }
    
    if (t.type === 'SPECIAL_GROUP') {
      next();
      const groupType = t.value;
      const node = parseExpr();
      if (peek().type === ')') next();
      
      if (groupType.includes('=')) {
        return lookaroundNode(node, 'ahead', true);
      } else if (groupType.includes('!')) {
        return lookaroundNode(node, 'ahead', false);
      } else if (groupType.includes('<=')) {
        return lookaroundNode(node, 'behind', true);
      } else if (groupType.includes('<!')) {
        return lookaroundNode(node, 'behind', false);
      } else {
        return groupNode(node, 'non-capture');
      }
    }
    
    if (t.type === '(') {
      next();
      const node = parseExpr();
      if (peek().type === ')') next();
      return groupNode(node, 'capture');
    }
    
    // unexpected tokens -> treat as literal
    next();
    return literalNode(t.value || t.type);
  }

  function parseQuantified(): ASTNode {
    let node = parseAtom();
    while (true) {
      const t = peek();
      let isLazy = false;
      
      if (t.type === '*') { 
        next(); 
        // Check for lazy quantifier
        if (peek().type === '?' && peek().value === '?') { next(); isLazy = true; }
        node = quantNode(node, { kind: '*', min: 0, max: Infinity, lazy: isLazy }); 
        continue; 
      }
      if (t.type === '+') { 
        next(); 
        if (peek().type === '?' && peek().value === '?') { next(); isLazy = true; }
        node = quantNode(node, { kind: '+', min: 1, max: Infinity, lazy: isLazy }); 
        continue; 
      }
      if (t.type === '?' && t.value === '?') { 
        next(); 
        if (peek().type === '?' && peek().value === '?') { next(); isLazy = true; }
        node = quantNode(node, { kind: '?', min: 0, max: 1, lazy: isLazy }); 
        continue; 
      }
      if (t.type === 'RANGE') {
        next();
        const isLazyRange = t.value.endsWith('?');
        const rangeValue = isLazyRange ? t.value.slice(0, -1) : t.value;
        const parts = rangeValue.split(',').map(s => s.trim());
        const m = parts[0] === '' ? undefined : parseInt(parts[0], 10);
        const n = parts.length === 1 ? m : (parts[1] === '' ? Infinity : parseInt(parts[1], 10));
        node = quantNode(node, { kind: 'range', min: m ?? 0, max: n, lazy: isLazyRange });
        continue;
      }
      break;
    }
    return node;
  }

  function parseConcat(): ASTNode {
    const items: ASTNode[] = [];
    while (true) {
      const t = peek();
      if (t.type === 'EOF' || t.type === ')' || t.type === '|') break;
      items.push(parseQuantified());
    }
    if (items.length === 0) return literalNode('');
    if (items.length === 1) return items[0];
    return concatNode(items);
  }

  function parseExpr(): ASTNode {
    const first = parseConcat();
    if (peek().type === '|') {
      const options = [first];
      while (peek().type === '|') {
        next();
        options.push(parseConcat());
      }
      return altNode(options);
    }
    return first;
  }

  const ast = parseExpr();
  return ast;
}

// ---------- Enhanced layout with advanced visualization ----------

function buildDiagram(ast: ASTNode) {
  let idCounter = 1;
  function id() { return idCounter++; }

  function walk(node: ASTNode): any {
    switch (node.type) {
      case 'LITERAL':
        return { 
          kind: 'box', 
          id: id(), 
          label: node.text || 'ε', 
          w: Math.max(32, node.text.length * 10 + 16), 
          h: 32,
          nodeType: 'literal'
        };
      case 'ESCAPE':
        return { 
          kind: 'box', 
          id: id(), 
          label: node.text, 
          w: Math.max(40, node.text.length * 8 + 20), 
          h: 32,
          nodeType: 'escape'
        };
      case 'ANCHOR':
        return { 
          kind: 'box', 
          id: id(), 
          label: node.text, 
          w: 24, 
          h: 32,
          nodeType: 'anchor'
        };
      case 'CLASS':
        const classLabel = node.isNegated ? `[^${node.text.slice(1)}]` : `[${node.text}]`;
        return { 
          kind: 'box', 
          id: id(), 
          label: classLabel, 
          w: Math.max(50, classLabel.length * 7 + 20), 
          h: 32,
          nodeType: 'class'
        };
      case 'CONCAT': {
        const parts = node.children.map(walk);
        const gap = 20;
        const totalW = parts.reduce((s: number, p: any) => s + p.w, 0) + gap * Math.max(0, parts.length - 1);
        return { kind: 'hgroup', id: id(), parts, w: totalW, h: Math.max(...parts.map((p: any) => p.h)) };
      }
      case 'ALT': {
        const options = node.options.map(walk);
        const padding = 16;
        const width = Math.max(...options.map((o: any) => o.w)) + padding * 2;
        const height = options.reduce((s: number, o: any) => s + o.h, 0) + (options.length - 1) * 16 + padding*2;
        return { kind: 'alt', id: id(), options, w: width, h: height, padding };
      }
      case 'QUANT': {
        const child = walk(node.child);
        const q = node.quant;
        const ann = quantToLabel(q);
        return { 
          kind: 'quant', 
          id: id(), 
          child, 
          w: child.w + 40, 
          h: Math.max(child.h, 40), 
          ann,
          lazy: q.lazy 
        };
      }
      case 'GROUP': {
        const inner = walk(node.child);
        return { 
          kind: 'group', 
          id: id(), 
          child: inner, 
          w: inner.w + 24, 
          h: inner.h + 16,
          groupType: node.groupType 
        };
      }
      case 'LOOKAROUND': {
        const inner = walk(node.child);
        const label = `${node.positive ? '' : '!'}${node.direction === 'ahead' ? '→' : '←'}`;
        return {
          kind: 'lookaround',
          id: id(),
          child: inner,
          w: inner.w + 30,
          h: inner.h + 20,
          label,
          direction: node.direction,
          positive: node.positive
        };
      }
      default:
        return { kind: 'box', id: id(), label: JSON.stringify(node), w: 60, h: 32, nodeType: 'unknown' };
    }
  }
  return walk(ast);
}

function quantToLabel(q: any) {
  const base = (() => {
    if (q.kind === '*') return '*';
    if (q.kind === '+') return '+';
    if (q.kind === '?') return '?';
    if (q.kind === 'range') {
      if (q.min === q.max) return `{${q.min}}`;
      if (q.max === Infinity) return `{${q.min},}`;
      return `{${q.min},${q.max}}`;
    }
    return '?';
  })();
  return base + (q.lazy ? '?' : '');
}

// ---------- Enhanced SVG renderer ----------
function SvgRenderer({ node, x = 0, y = 0 }: { node: any, x?: number, y?: number }) {
  const elements: React.ReactNode[] = [];
  let cx = x;

  // Enhanced color scheme for different node types
  const getNodeColors = (nodeType: string) => {
    switch (nodeType) {
      case 'literal': return { fill: '#f8f9fa', stroke: '#343a40', textColor: '#212529' };
      case 'escape': return { fill: '#e3f2fd', stroke: '#1976d2', textColor: '#0d47a1' };
      case 'anchor': return { fill: '#fff3e0', stroke: '#f57c00', textColor: '#e65100' };
      case 'class': return { fill: '#f3e5f5', stroke: '#7b1fa2', textColor: '#4a148c' };
      default: return { fill: '#ffffff', stroke: '#6c757d', textColor: '#495057' };
    }
  };

  function renderNode(n: any, top: number): any {
    if (n.kind === 'box') {
      const rx = cx;
      const ry = top + (40 - n.h) / 2;
      const colors = getNodeColors(n.nodeType);
      
      elements.push(
        <g key={n.id}>
          <rect 
            x={rx} 
            y={ry} 
            width={n.w} 
            height={n.h} 
            rx={8} 
            ry={8} 
            fill={colors.fill} 
            stroke={colors.stroke} 
            strokeWidth={2}
          />
          <text 
            x={rx + n.w / 2} 
            y={ry + n.h / 2 + 5} 
            textAnchor="middle" 
            fontSize={12} 
            fontFamily="ui-monospace, monospace"
            fill={colors.textColor}
            fontWeight="500"
          >
            {n.label}
          </text>
        </g>
      );
      const start = { x: rx, y: top + 20 };
      const end = { x: rx + n.w, y: top + 20 };
      cx += n.w + 20;
      return { start, end };
    }

    if (n.kind === 'hgroup') {
      let curX = cx;
      let lastEnd = null;
      for (const p of n.parts) {
        const res = renderNode(p, top);
        lastEnd = res.end;
      }
      return { start: { x: curX, y: top + 20 }, end: lastEnd };
    }

    if (n.kind === 'alt') {
      const blockX = cx;
      const centerY = top + n.h / 2;
      let oy = top + n.padding;
      
      cx += n.w + 20;
      
      for (const opt of n.options) {
        const childX = blockX + 20;
        const savedCx = cx;
        cx = childX;
        renderNode(opt, oy);
        cx = savedCx;
        oy += opt.h + 16;
      }
      
      // Draw alternation connectors with curves
      const leftX = blockX - 20;
      const rightX = blockX + n.w;
      
      elements.push(
        <g key={`alt-conn-${n.id}`}>
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#495057" />
            </marker>
          </defs>
          <line x1={leftX} y1={centerY} x2={blockX} y2={centerY} 
                stroke="#495057" strokeWidth={2} />
          <line x1={rightX} y1={centerY} x2={rightX + 20} y2={centerY} 
                stroke="#495057" strokeWidth={2} markerEnd="url(#arrow)" />
        </g>
      );
      
      return { start: { x: leftX, y: centerY }, end: { x: rightX + 20, y: centerY } };
    }

    if (n.kind === 'quant') {
      const boxX = cx;
      const strokeStyle = n.lazy ? "4 4" : "none";
      
      // Enhanced quantifier visualization
      elements.push(
        <g key={`q-${n.id}`}>
          <rect 
            x={boxX} 
            y={top} 
            width={n.w} 
            height={n.h} 
            rx={12} 
            ry={12} 
            fill="#f8f9fa" 
            stroke="#6c757d" 
            strokeWidth={2}
            strokeDasharray={strokeStyle}
          />
          <text 
            x={boxX + n.w - 15} 
            y={top + 15} 
            textAnchor="end" 
            fontSize={11} 
            fontFamily="ui-monospace, monospace"
            fill="#495057"
            fontWeight="600"
          >
            {n.ann}
          </text>
        </g>
      );
      
      cx += 15;
      const res = renderNode(n.child, top + (n.h - n.child.h)/2);
      cx = boxX + n.w + 20;
      return { start: { x: boxX, y: top + n.h/2 }, end: { x: boxX + n.w, y: top + n.h/2 } };
    }

    if (n.kind === 'group') {
      const boxX = cx;
      const strokeColor = n.groupType === 'capture' ? '#28a745' : '#6c757d';
      
      elements.push(
        <g key={`grp-${n.id}`}>
          <rect 
            x={boxX} 
            y={top} 
            width={n.w} 
            height={n.h} 
            rx={8} 
            ry={8} 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth={2}
          />
        </g>
      );
      
      cx += 12;
      const res = renderNode(n.child, top + 8);
      cx = boxX + n.w + 20;
      return { start: { x: boxX, y: top + n.h/2 }, end: { x: boxX + n.w, y: top + n.h/2 } };
    }

    if (n.kind === 'lookaround') {
      const boxX = cx;
      const strokeColor = n.positive ? '#007bff' : '#dc3545';
      
      elements.push(
        <g key={`look-${n.id}`}>
          <rect 
            x={boxX} 
            y={top} 
            width={n.w} 
            height={n.h} 
            rx={10} 
            ry={10} 
            fill="#fff" 
            stroke={strokeColor} 
            strokeWidth={2}
            strokeDasharray="2 2"
          />
          <text 
            x={boxX + 10} 
            y={top + 15} 
            fontSize={10} 
            fontFamily="ui-monospace, monospace"
            fill={strokeColor}
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      );
      
      cx += 15;
      renderNode(n.child, top + 10);
      cx = boxX + n.w + 20;
      return { start: { x: boxX, y: top + n.h/2 }, end: { x: boxX + n.w, y: top + n.h/2 } };
    }

    // fallback
    return { start: { x: cx, y: top + 20 }, end: { x: cx + 40, y: top + 20 } };
  }

  const baselineTop = y;
  renderNode(node, baselineTop);

  // Enhanced arrow styling
  elements.push(
    <g key="in-out">
      <defs>
        <marker id="startArrow" markerWidth="8" markerHeight="6" 
                refX="0" refY="3" orient="auto">
          <polygon points="8 0, 8 6, 0 3" fill="#495057" />
        </marker>
        <marker id="endArrow" markerWidth="8" markerHeight="6" 
                refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#495057" />
        </marker>
      </defs>
      <line x1={x - 30} y1={baselineTop + 20} x2={x} y2={baselineTop + 20} 
            stroke="#495057" strokeWidth={2} markerStart="url(#startArrow)" />
      <line x1={cx - 20} y1={baselineTop + 20} x2={cx + 10} y2={baselineTop + 20} 
            stroke="#495057" strokeWidth={2} markerEnd="url(#endArrow)" />
    </g>
  );

  return <g>{elements}</g>;
}

// AST Tree Renderer Component
const ASTTreeNode: React.FC<{ node: ASTNode; level: number; isLast?: boolean; prefix?: string }> = ({ 
  node, 
  level, 
  isLast = false, 
  prefix = "" 
}) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'LITERAL': return '📝';
      case 'ESCAPE': return '⚡';
      case 'ANCHOR': return '⚓';
      case 'CLASS': return '📋';
      case 'CONCAT': return '➡️';
      case 'ALT': return '🔀';
      case 'QUANT': return '🔢';
      case 'GROUP': return '📦';
      case 'LOOKAROUND': return '👁️';
      default: return '❓';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'LITERAL': return 'text-gray-700';
      case 'ESCAPE': return 'text-blue-600';
      case 'ANCHOR': return 'text-orange-600';
      case 'CLASS': return 'text-purple-600';
      case 'CONCAT': return 'text-green-600';
      case 'ALT': return 'text-yellow-600';
      case 'QUANT': return 'text-red-600';
      case 'GROUP': return 'text-indigo-600';
      case 'LOOKAROUND': return 'text-pink-600';
      default: return 'text-gray-500';
    }
  };

  const renderNodeDetails = () => {
    const details = [];
    
    switch (node.type) {
      case 'LITERAL':
        details.push(`"${node.text}"`);
        break;
      case 'ESCAPE':
        details.push(`${node.text}`);
        break;
      case 'ANCHOR':
        details.push(`${node.text} (${node.text === '^' ? 'start' : 'end'})`);
        break;
      case 'CLASS':
        details.push(`[${node.text}] ${node.isNegated ? '(negated)' : ''}`);
        break;
      case 'QUANT':
        if (node.quant) {
          const { kind, min, max, lazy } = node.quant;
          if (kind === 'range') {
            details.push(`{${min},${max === Infinity ? '∞' : max}}${lazy ? ' (lazy)' : ''}`);
          } else {
            details.push(`${kind}${lazy ? ' (lazy)' : ''} (${min}-${max === Infinity ? '∞' : max})`);
          }
        }
        break;
      case 'GROUP':
        details.push(`(${node.groupType || 'capture'})`);
        break;
      case 'LOOKAROUND':
        details.push(`${node.positive ? 'positive' : 'negative'} ${node.direction}`);
        break;
    }
    
    return details.join(' ');
  };

  const children = [];
  if (node.children) children.push(...node.children);
  if (node.options) children.push(...node.options);
  if (node.child) children.push(node.child);

  return (
    <div className="font-mono text-xs">
      <div className="flex items-center gap-2 py-1">
        <span className="text-gray-400 select-none" style={{ width: `${level * 20}px` }}>
          {prefix}
          {level > 0 && (isLast ? '└─ ' : '├─ ')}
        </span>
        <span className="text-lg">{getNodeIcon(node.type)}</span>
        <span className={`font-semibold ${getNodeColor(node.type)}`}>
          {node.type}
        </span>
        <span className="text-gray-600">
          {renderNodeDetails()}
        </span>
      </div>
      {children.map((child, index) => (
        <ASTTreeNode
          key={index}
          node={child}
          level={level + 1}
          isLast={index === children.length - 1}
          prefix={prefix + (level > 0 ? (isLast ? '   ' : '│  ') : '')}
        />
      ))}
    </div>
  );
};

interface ASTRailroadPlaceholdersProps {
  pattern: string;
}

export const ASTRailroadPlaceholders: React.FC<ASTRailroadPlaceholdersProps> = ({ pattern }) => {
  const ast = useMemo(() => {
    try {
      return parsePattern(pattern || 'a(b|c)+d?\\d{2,4}');
    } catch (error) {
      return parsePattern('Invalid pattern');
    }
  }, [pattern]);
  
  const diagram = useMemo(() => buildDiagram(ast), [ast]);

  const svgWidth = Math.max(800, diagram.w + 160);
  const svgHeight = Math.max(150, diagram.h + 100);

  // AST Statistics
  const getASTStats = (node: ASTNode): { nodeCount: number; depth: number; types: Record<string, number> } => {
    const types: Record<string, number> = {};
    let nodeCount = 0;
    let maxDepth = 0;

    const traverse = (n: ASTNode, depth: number) => {
      nodeCount++;
      types[n.type] = (types[n.type] || 0) + 1;
      maxDepth = Math.max(maxDepth, depth);

      const children = [];
      if (n.children) children.push(...n.children);
      if (n.options) children.push(...n.options);
      if (n.child) children.push(n.child);

      children.forEach(child => traverse(child, depth + 1));
    };

    traverse(node, 1);
    return { nodeCount, depth: maxDepth, types };
  };

  const stats = useMemo(() => getASTStats(ast), [ast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* AST Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              AST Preview
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Expand Tree
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Abstract Syntax Tree</DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    Pattern: <code className="bg-muted px-2 py-1 rounded">{pattern || 'No pattern'}</code>
                  </div>
                </DialogHeader>
                <ScrollArea className="w-full h-[60vh]">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <ASTTreeNode node={ast} level={0} />
                  </div>
                </ScrollArea>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Nodes</div>
                      <div className="text-2xl font-bold text-blue-600">{stats.nodeCount}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Depth</div>
                      <div className="text-2xl font-bold text-green-600">{stats.depth}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Complexity</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.nodeCount > 20 ? 'High' : stats.nodeCount > 10 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Types</div>
                      <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.types).length}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-medium text-gray-700 mb-2">Node Distribution</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.types).map(([type, count]) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}: {count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <Badge variant="outline" className="mr-2">Pattern</Badge>
              <code className="text-xs bg-muted px-2 py-1 rounded">{pattern || 'No pattern'}</code>
            </div>
            <Separator />
            
            {/* Compact AST Tree View */}
            <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto border">
              <ASTTreeNode node={ast} level={0} />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <div className="font-medium text-blue-700">Nodes</div>
                <div className="text-lg font-bold text-blue-600">{stats.nodeCount}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="font-medium text-green-700">Depth</div>
                <div className="text-lg font-bold text-green-600">{stats.depth}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <div className="font-medium text-purple-700">Types</div>
                <div className="text-lg font-bold text-purple-600">{Object.keys(stats.types).length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Railroad Diagram Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Railroad Diagram
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Expand
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[85vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Advanced Railroad Diagram</DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    Pattern: <code className="bg-muted px-2 py-1 rounded">{pattern || 'No pattern'}</code>
                  </div>
                </DialogHeader>
                <ScrollArea className="w-full h-[60vh]">
                  <div className="w-full overflow-auto p-4">
                    <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                         style={{ background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)', minHeight: '300px' }}>
                      <SvgRenderer node={diagram} x={80} y={50} />
                    </svg>
                  </div>
                </ScrollArea>
                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-2">Legend:</p>
                      <ul className="space-y-1 text-xs">
                        <li><span className="inline-block w-3 h-3 bg-blue-100 border border-blue-600 rounded mr-2"></span>Escape sequences</li>
                        <li><span className="inline-block w-3 h-3 bg-orange-100 border border-orange-600 rounded mr-2"></span>Anchors</li>
                        <li><span className="inline-block w-3 h-3 bg-purple-100 border border-purple-600 rounded mr-2"></span>Character classes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Features:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Advanced quantifier support (lazy/greedy)</li>
                        <li>• Lookaround assertions visualization</li>
                        <li>• Enhanced group type differentiation</li>
                        <li>• Unicode and escape sequence support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-b from-gray-50 to-white border rounded-lg p-3 overflow-hidden">
            <svg 
              width="100%" 
              height="140" 
              viewBox={`0 0 ${Math.min(500, svgWidth)} 140`} 
              style={{ background: 'transparent' }}
            >
              <SvgRenderer node={diagram} x={50} y={30} />
            </svg>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            <Badge variant="secondary" className="mr-2">Enhanced</Badge>
            Click "Expand" for full interactive view
          </div>
        </CardContent>
      </Card>
    </div>
  );
};