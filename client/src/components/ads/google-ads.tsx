import { useEffect } from 'react';

interface GoogleAdsProps {
  adSlot: string;
  format?: 'auto' | 'rectangle' | 'banner' | 'leaderboard';
  responsive?: boolean;
  className?: string;
}

export function GoogleAds({ 
  adSlot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}: GoogleAdsProps) {
  useEffect(() => {
    try {
      // Initialize Google AdSense
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Google Ads initialization error:', error);
    }
  }, []);

  return (
    <div className={`google-ads-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0000000000000000" // Replace with your actual publisher ID
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

// Banner Ad Component
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAds
      adSlot="1234567890"
      format="banner"
      className={`banner-ad ${className}`}
    />
  );
}

// Rectangle Ad Component
export function RectangleAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAds
      adSlot="2345678901"
      format="rectangle"
      className={`rectangle-ad ${className}`}
    />
  );
}

// In-feed Ad Component
export function InFeedAd({ className = '' }: { className?: string }) {
  return (
    <div className={`in-feed-ad glass-card rounded-lg p-6 my-8 ${className}`}>
      <div className="text-xs text-slate-400 mb-2 text-center">Advertisement</div>
      <GoogleAds
        adSlot="3456789012"
        format="auto"
        responsive={true}
      />
    </div>
  );
}

// Sidebar Ad Component
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`sidebar-ad sticky top-4 ${className}`}>
      <div className="text-xs text-slate-400 mb-2 text-center">Advertisement</div>
      <GoogleAds
        adSlot="4567890123"
        format="rectangle"
        className="w-full"
      />
    </div>
  );
}

// Article Bottom Ad
export function ArticleBottomAd({ className = '' }: { className?: string }) {
  return (
    <div className={`article-bottom-ad mt-8 mb-6 ${className}`}>
      <div className="text-xs text-slate-400 mb-2 text-center">Advertisement</div>
      <GoogleAds
        adSlot="5678901234"
        format="banner"
        className="w-full"
      />
    </div>
  );
}

// Declare global types for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}