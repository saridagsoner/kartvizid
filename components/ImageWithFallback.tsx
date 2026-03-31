import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  initialsClassName?: string;
  forceInitials?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover", 
  initialsClassName = "text-3xl sm:text-5xl font-black",
  forceInitials = false
}) => {
  const [hasError, setHasError] = useState(false);

  // Helper to generate a background color based on name (consistent with project style)
  const getRandomStyles = (name: string) => {
    const colors = [
      { bg: '#1f6d7820', text: '#1f6d78' },
      { bg: '#2dd4bf20', text: '#2dd4bf' },
      { bg: '#f59e0b20', text: '#d97706' },
      { bg: '#8b5cf620', text: '#7c3aed' },
      { bg: '#ec489920', text: '#db2777' },
      { bg: '#3b82f620', text: '#2563eb' },
      { bg: '#10b98120', text: '#059669' },
      { bg: '#ef444420', text: '#dc2626' },
      { bg: '#6366f120', text: '#4f46e5' }
    ];
    
    const displayName = name || 'A';
    let hash = 0;
    for (let i = 0; i < displayName.length; i++) {
      hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];
    return { backgroundColor: color.bg, color: color.text };
  };

  const displayName = alt || 'A';
  const styles = getRandomStyles(displayName);

  if (forceInitials || !src || hasError) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center relative"
        style={styles}
      >
        <span className={`${initialsClassName} opacity-80 uppercase leading-none`}>
          {displayName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => {
        console.warn(`Image failed to load, falling back to initials: ${src}`);
        setHasError(true);
      }} 
    />
  );
};

export default ImageWithFallback;
