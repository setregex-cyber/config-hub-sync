import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Heart } from 'lucide-react';

export const AdBlockDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    // Check if ads are blocked by trying to create a bait element
    const detectAdBlock = async () => {
      try {
        const bait = document.createElement('div');
        bait.className = 'ad ads adsbox adsbygoogle ad-placement ad-placeholder';
        bait.style.cssText = 'position:absolute;top:-999px;left:-999px;width:1px;height:1px;';
        document.body.appendChild(bait);
        
        // Wait a bit for ad blockers to act
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const isBlocked = bait.offsetHeight === 0 || 
                         window.getComputedStyle(bait).display === 'none' ||
                         bait.clientHeight === 0;
        
        document.body.removeChild(bait);
        setIsAdBlocked(isBlocked);
      } catch (e) {
        setIsAdBlocked(true);
      }
    };

    detectAdBlock();
  }, []);

  if (!isAdBlocked) {
    return <>{children}</>;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6 text-center space-y-3">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Ad Blocker Detected</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We noticed you're using an ad blocker. We respect your choice! 
          This tool is free to use, and ads help keep it running.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-primary">
          <Heart className="h-4 w-4 fill-current" />
          <span>Thanks for using SetRegex!</span>
        </div>
      </CardContent>
    </Card>
  );
};
