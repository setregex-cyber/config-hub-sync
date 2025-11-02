import React from 'react';
import { AdBlockDetector } from './AdBlockDetector';

export const TopAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-24 mb-4 flex items-center justify-center">
      <div className="w-[728px] h-[90px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-xs font-medium">Advertisement Space - Top Banner</div>
        <div className="text-xs text-muted-foreground mt-1">728x90</div>
      </div>
    </div>
  </AdBlockDetector>
);

export const SidebarAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-64 flex items-center justify-center">
      <div className="w-[300px] h-[250px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-xs font-medium">Advertisement Space</div>
        <div className="text-xs text-muted-foreground mt-1">300x250</div>
      </div>
    </div>
  </AdBlockDetector>
);

export const MiddleAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-24 mt-4 flex items-center justify-center">
      <div className="w-[728px] h-[90px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-xs font-medium">Advertisement Space - Middle Banner</div>
        <div className="text-xs text-muted-foreground mt-1">728x90</div>
      </div>
    </div>
  </AdBlockDetector>
);

export const BottomAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-24 mt-4 flex items-center justify-center">
      <div className="w-[728px] h-[90px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-xs font-medium">Advertisement Space - Bottom Banner</div>
        <div className="text-xs text-muted-foreground mt-1">728x90</div>
      </div>
    </div>
  </AdBlockDetector>
);

export const FloatingAdPlaceholder: React.FC = () => (
  <div className="floating-ad flex items-center justify-center">
    <div className="w-[300px] h-[120px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
      <div className="text-xs font-medium">Floating Ad</div>
      <div className="text-xs text-muted-foreground mt-1">300x120</div>
    </div>
  </div>
);

export const ContentAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-24 my-4 flex items-center justify-center">
      <div className="w-[728px] h-[90px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-xs font-medium">Advertisement Space - Content Banner</div>
        <div className="text-xs text-muted-foreground mt-1">728x90</div>
      </div>
    </div>
  </AdBlockDetector>
);

export const BannerAdPlaceholder: React.FC = () => (
  <AdBlockDetector>
    <div className="ad-placeholder h-32 mx-auto max-w-4xl flex items-center justify-center">
      <div className="w-[970px] h-[250px] border-2 border-dashed border-muted-foreground/30 rounded flex flex-col items-center justify-center bg-muted/20">
        <div className="text-sm font-medium">Advertisement Space - Footer Banner</div>
        <div className="text-xs text-muted-foreground mt-1">970x250</div>
      </div>
    </div>
  </AdBlockDetector>
);