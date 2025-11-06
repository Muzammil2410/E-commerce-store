import React, { useState } from "react";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
};

export default function Image({ width, height, priority, fill, style, alt = "", ...rest }: Props) {
  const [imageError, setImageError] = useState(false);
  const computedStyle = fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...(style as any) } : style;
  
  // Use loading attribute based on priority
  const loadingAttr = rest.loading ?? (priority ? 'eager' : 'lazy');
  
  // Decoding attribute for better performance
  const decodingAttr = priority ? 'sync' : 'async';

  if (imageError && rest.onError) {
    return <img {...rest} width={width} height={height} style={computedStyle} alt={alt} />;
  }

  return (
    <img 
      {...rest} 
      width={width} 
      height={height} 
      loading={loadingAttr}
      decoding={decodingAttr}
      style={computedStyle} 
      alt={alt || 'Image'}
      onError={(e) => {
        setImageError(true);
        if (rest.onError) rest.onError(e);
      }}
    />
  );
}


