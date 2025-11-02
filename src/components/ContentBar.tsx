import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface ContentItem {
  heading: string;
  subheading: string;
  description: string;
}

interface BubbleContent {
  title: string;
  items: ContentItem[];
}

const bubbleData: BubbleContent[] = [
  {
    title: "Overview",
    items: [
      {
        heading: "What Is the AI Regex Generator?",
        subheading: "Regex made friendly",
        description: "An intelligent regex tool that turns natural language into working patterns. Describe what you want to match, and our AI builds the regex for you. No cryptic syntax memorization required."
      },
      {
        heading: "Key Benefits",
        subheading: "Make regex feel easy again",
        description: "Save hours of debugging with instant pattern generation, real-time testing, and AI-powered explanations. Turn complex pattern matching into simple conversations with your regex code assistant."
      },
      {
        heading: "Who Is It For",
        subheading: "Built for developers, testers, and analysts",
        description: "Perfect for developers cleaning data, QA testers validating inputs, and data analysts extracting insights. Whether you're a regex expert or just starting out, our AI regex generator adapts to your skill level."
      },
      {
        heading: "How It Works",
        subheading: "From idea to pattern in seconds",
        description: "Describe your matching needs in plain English, test against real data, and get instant regex patterns with clear explanations. Our AI learns from your test strings to create accurate, optimized regex patterns."
      }
    ]
  },
  {
    title: "Main Features",
    items: [
      {
        heading: "AI Regex Generator",
        subheading: "Natural language to regex in seconds",
        description: "Type what you want to match in plain English and watch AI create the perfect regex pattern. Our intelligent regex tool understands context from your test data to generate accurate patterns every time."
      },
      {
        heading: "Regex Tester",
        subheading: "Test patterns instantly with real data",
        description: "Paste your text and see matches highlighted in real-time. Our regex tester shows exactly what your pattern captures, helping you validate and refine patterns with confidence."
      },
      {
        heading: "Regex Optimizer",
        subheading: "Performance-tuned patterns automatically",
        description: "Get suggestions to make your regex faster and more efficient. Our regex optimizer analyzes your patterns and recommends improvements for better performance and readability."
      },
      {
        heading: "Explain / Fix Mode",
        subheading: "Understand any regex pattern",
        description: "Paste any regex and get a human-readable explanation of what it does. Our AI breaks down complex patterns into simple terms and suggests fixes for common mistakes."
      },
      {
        heading: "Pattern Library",
        subheading: "Common patterns at your fingertips",
        description: "Access pre-built regex patterns for emails, URLs, phone numbers, and more. Save time with battle-tested patterns that work across different regex engines and programming languages."
      }
    ]
  },
  {
    title: "UI Sections",
    items: [
      {
        heading: "Input Panel",
        subheading: "Your regex workspace",
        description: "Clean interface for writing and editing regex patterns. Syntax highlighting and error detection help you craft perfect patterns with visual feedback as you type."
      },
      {
        heading: "Output Panel",
        subheading: "See your matches clearly",
        description: "Visual display of pattern matches with color-coded groups. Instantly understand what your regex captures and how it handles different input scenarios."
      },
      {
        heading: "Test Area",
        subheading: "Real-time pattern validation",
        description: "Test your regex against multiple strings simultaneously. See matches, groups, and edge cases highlighted as you refine your pattern for production use."
      },
      {
        heading: "Sidebar / Library",
        subheading: "Quick access to saved patterns",
        description: "Browse your pattern history and commonly used regex templates. Organize and reuse patterns across projects for faster development and consistent results."
      },
      {
        heading: "Settings Panel",
        subheading: "Customize your experience",
        description: "Configure regex flags, matching modes, and display preferences. Tailor the regex tool to match your workflow and preferred coding environment."
      }
    ]
  },
  {
    title: "AI Interaction",
    items: [
      {
        heading: "Chat Interface",
        subheading: "Talk to your regex assistant",
        description: "Conversational AI that helps you build and debug patterns through natural dialogue. Ask questions, request changes, and get instant regex help in plain English."
      },
      {
        heading: "Inline Suggestions",
        subheading: "Smart completions as you type",
        description: "Get intelligent pattern suggestions while writing regex. Our AI code assistant predicts what you're trying to match and offers helpful completions in real-time."
      },
      {
        heading: "Natural Language Understanding",
        subheading: "Describe what you want, get working regex",
        description: "Our AI understands complex matching requirements in everyday language. No need to remember syntax—just explain your goal and let the regex generator do the work."
      },
      {
        heading: "Explain in Simple Terms",
        subheading: "Demystify any regex pattern",
        description: "Click any pattern to get a plain-English breakdown of how it works. Perfect for learning regex or understanding patterns written by others."
      }
    ]
  },
  {
    title: "Integrations",
    items: [
      {
        heading: "Export Code Snippets",
        subheading: "JavaScript, Python, Java, and more",
        description: "Copy working code in your preferred language with proper escaping and syntax. Get production-ready regex code that drops straight into your project."
      },
      {
        heading: "Browser Extension",
        subheading: "Regex help wherever you code",
        description: "Test and generate patterns directly in your browser without switching tabs. Seamless integration with your development workflow for faster pattern creation."
      },
      {
        heading: "API Endpoint",
        subheading: "Integrate AI regex into your apps",
        description: "Programmatic access to our regex generator and tester for your own applications. Build pattern matching into your tools with our developer-friendly API."
      },
      {
        heading: "Embed Widget",
        subheading: "Add regex tools to your website",
        description: "Drop a customizable regex tester widget into your documentation or learning platform. Let your users test patterns without leaving your site."
      }
    ]
  },
  {
    title: "Examples & Tutorials",
    items: [
      {
        heading: "Quick Start Guide",
        subheading: "From zero to regex hero in minutes",
        description: "Step-by-step walkthrough to create your first AI-generated regex pattern. Learn the basics and start matching patterns like a pro in under 5 minutes."
      },
      {
        heading: "Use Case Examples",
        subheading: "Real-world regex solutions",
        description: "Explore practical examples from email validation to log parsing. See how developers use our AI regex generator to solve common pattern matching challenges."
      },
      {
        heading: "Video Tutorials",
        subheading: "Watch and learn regex visually",
        description: "Short, focused videos showing advanced regex techniques and AI features. Perfect for visual learners who want to master pattern matching quickly."
      },
      {
        heading: "Interactive Demos",
        subheading: "Hands-on regex practice",
        description: "Try real scenarios with guided challenges and instant feedback. Build confidence with interactive exercises that teach regex through doing."
      }
    ]
  },
  {
    title: "Account & Settings",
    items: [
      {
        heading: "Sign In / Sign Up",
        subheading: "Save your work across devices",
        description: "Create a free account to sync your regex patterns and preferences. Access your pattern library from anywhere and never lose your work."
      },
      {
        heading: "Save Pattern History",
        subheading: "Never lose a working regex",
        description: "Automatically save every pattern you create with searchable history. Quickly find and reuse patterns from past projects without starting from scratch."
      },
      {
        heading: "Manage AI Suggestions",
        subheading: "Train your regex assistant",
        description: "Customize how the AI helps you based on your coding style and preferences. Get smarter suggestions that match your workflow and skill level."
      },
      {
        heading: "Light / Dark Mode",
        subheading: "Code comfortably day or night",
        description: "Switch between beautiful light and dark themes. Easy on the eyes whether you're coding at dawn or debugging at midnight."
      }
    ]
  },
  {
    title: "Technical Details",
    items: [
      {
        heading: "Regex Engine Compatibility",
        subheading: "Works with JavaScript, Python, Java, and more",
        description: "Patterns tested across multiple regex engines to ensure compatibility. Get reliable results whether you're using PCRE, JavaScript RegExp, or Python re module."
      },
      {
        heading: "AI Model Overview",
        subheading: "Powered by advanced language models",
        description: "Built on state-of-the-art AI trained on millions of regex patterns. Our model understands context and generates accurate patterns from natural language descriptions."
      },
      {
        heading: "Data Privacy & Security",
        subheading: "Your patterns stay private",
        description: "We don't store or share your test data without permission. Industry-standard encryption keeps your regex patterns and sensitive information secure."
      },
      {
        heading: "Version Updates",
        subheading: "Regular improvements and new features",
        description: "Track new regex tools, AI enhancements, and bug fixes in our transparent changelog. We're constantly improving based on user feedback and latest regex best practices."
      }
    ]
  }
];

export const ContentBar = () => {
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number; width: number } | null>(null);

  const handleMouseEnter = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredBubble(index);
    const rect = e.currentTarget.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const MARGIN = 8; // Safety margin from viewport edges
    const BASE_WIDTH = 384; // Tailwind w-96

    const width = Math.min(BASE_WIDTH, vw - MARGIN * 2);
    const centeredLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.max(MARGIN, Math.min(centeredLeft, vw - width - MARGIN));

    const maxHeight = Math.round(vh * 0.7); // matches max-h-[70vh]
    let top = rect.bottom + MARGIN;
    if (top + maxHeight > vh - MARGIN) {
      top = vh - MARGIN - maxHeight;
    }

    setPopupPos({ left, top, width });
  };
  return (
    <div className="w-full py-8 glass-effect border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 justify-center items-start">
          {bubbleData.map((bubble, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={() => { setHoveredBubble(null); setPopupPos(null); }}
            >
              {/* Bubble */}
              <div className="glass-card px-6 py-3 bubble-pop cursor-pointer bg-gradient-to-br from-primary/20 to-accent/10 hover:from-primary/30 hover:to-accent/20">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm whitespace-nowrap">
                    {bubble.title}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-300 ${
                      hoveredBubble === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Popup Content */}
              {hoveredBubble === index && (
                <Card
                  className="fixed z-50 glass-card animate-fade-in p-6 shadow-2xl max-h-[70vh] overflow-y-auto overscroll-contain"
                  style={{
                    left: popupPos?.left,
                    top: popupPos?.top,
                    width: popupPos?.width,
                  }}
                >
                  <div className="space-y-5">
                    {bubble.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="group cursor-pointer p-3 rounded-lg hover:bg-primary/5 transition-all duration-200"
                      >
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {item.heading}
                        </h3>
                        <p className="text-xs font-medium text-primary/80 mb-2 italic">
                          {item.subheading}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
