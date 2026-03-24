import React from 'react';

interface AdSlotProps {
    type: 'banner' | 'sidebar' | 'inline';
    id: string;
    label?: string;
}

export default function AdSlot({ type, id, label }: AdSlotProps) {
    const classMap = {
        banner: 'ad-slot-banner',
        sidebar: 'ad-slot-sidebar',
        inline: 'ad-slot-inline',
    };

    const labelMap = {
        banner: 'Banner Ad (728×90)',
        sidebar: 'Sidebar Ad (300×250)',
        inline: 'In-Content Ad (468×60)',
    };

    return (
        <div className={`ad-slot ${classMap[type]}`} id={id}>
            <span className="ad-slot-label">إعلان</span>
            {/* 
        Google AdSense integration:
        Replace this div's content with your AdSense ad unit code.
        Example:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
            <span>{label || labelMap[type]}</span>
        </div>
    );
}
