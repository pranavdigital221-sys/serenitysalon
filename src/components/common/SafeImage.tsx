import React, { useState, useEffect } from 'react';
import { PLACEHOLDER_ASSETS } from '../../utils/assets';
import { getFallbackVisual } from '../../utils/productVisuals';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackType?: 'product' | 'service' | 'category' | 'avatar' | 'banner' | 'blog' | 'tool';
  customFallback?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackType = 'product',
  customFallback,
  priority = false,
  objectFit = 'cover',
  className = '',
  containerClassName = '',
  ...rest
}) => {
  // Guaranteed visual artwork that never relies on external network
  const visualArtwork = getFallbackVisual(fallbackType, alt, customFallback || src);

  const defaultFallback = customFallback || (
    fallbackType === 'service' || fallbackType === 'category' ? PLACEHOLDER_ASSETS.service :
    fallbackType === 'avatar' ? PLACEHOLDER_ASSETS.avatar :
    PLACEHOLDER_ASSETS.product
  );

  const [imgSrc, setImgSrc] = useState<string>(src || visualArtwork || defaultFallback);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setErrorCount(0);
      setIsLoaded(false);
    } else {
      setImgSrc(visualArtwork);
      setErrorCount(1);
      setIsLoaded(true);
    }
  }, [src, visualArtwork]);

  const handleError = () => {
    if (errorCount === 0) {
      // Step 1: Switch to guaranteed embedded visual artwork Data-URI
      setErrorCount(1);
      setImgSrc(visualArtwork);
      setIsLoaded(false);
    } else if (errorCount === 1) {
      // Step 2: Switch to backup default fallback
      setErrorCount(2);
      setImgSrc(defaultFallback);
      setIsLoaded(false);
    } else {
      // Step 3: Final resilient visual
      setErrorCount(3);
      setImgSrc(visualArtwork);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      src={imgSrc || visualArtwork}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      onLoad={handleLoad}
      className={`${objectFit === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-90'
      } ${className}`}
      {...rest}
    />
  );
};

