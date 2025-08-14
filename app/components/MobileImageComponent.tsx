// components/MobileImageComponent.tsx

import React, { useState, useCallback } from "react";
import { View, Image as RNImage, ActivityIndicator, Platform } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { images } from '../assets';

interface MobileImageComponentProps {
  source: any;
  className?: string;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fallbackSource?: any;
  showLoadingIndicator?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  retryCount?: number;
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
  transition?: number;
  placeholder?: any;
}

const MobileImageComponent: React.FC<MobileImageComponentProps> = ({
  source,
  className,
  style,
  contentFit = "cover",
  fallbackSource,
  showLoadingIndicator = true,
  onError,
  onLoad,
  retryCount = 2,
  cachePolicy = "memory-disk",
  transition = 300,
  placeholder,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Default fallback - update path to match your project structure
  const defaultFallback = images.plugLogo;

  // Normalize source
  const normalizeSource = (src: any) => {
    if (!src) return null;
    
    // If it's already a require() call (number on mobile)
    if (typeof src === "number") return src;
    
    // If it's a string URL
    if (typeof src === "string") return { uri: src };
    
    // If it's an object with uri
    if (typeof src === "object" && src.uri) return src;
    
    // If it's a require() object
    if (typeof src === "object" && !src.uri) return src;
    
    return src;
  };

  const normalizedSource = normalizeSource(source);
  const isRemoteImage = normalizedSource && normalizedSource.uri;

  const handleImageError = useCallback(() => {
    console.log("Image load error:", normalizedSource);
    
    if (retryAttempt < retryCount && isRemoteImage) {
      setTimeout(() => {
        setRetryAttempt(prev => prev + 1);
      }, 1000);
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  }, [retryAttempt, retryCount, onError, isRemoteImage, normalizedSource]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // If error occurred, show fallback
  if (hasError) {
    const fallback = fallbackSource || defaultFallback;
    return (
      <View style={[{ overflow: 'hidden' }, style]} className={className}>
        <ExpoImage
          source={normalizeSource(fallback)}
          style={{ width: '100%', height: '100%' }}
          contentFit={contentFit}
          transition={transition}
          {...props}
        />
      </View>
    );
  }

  // Ensure we have proper dimensions
  const imageStyle = {
    width: '100%',
    height: '100%',
    ...style
  };

  // Always use ExpoImage for consistency
  return (
    <View style={[{ overflow: 'hidden' }, style]} className={className}>
      {showLoadingIndicator && isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
          <ActivityIndicator size="small" color="#10b981" />
        </View>
      )}
      
      <ExpoImage
        source={normalizedSource}
        style={imageStyle}
        contentFit={contentFit}
        onError={handleImageError}
        onLoad={handleImageLoad}
        transition={transition}
        cachePolicy={cachePolicy}
        placeholder={placeholder || { blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        {...props}
      />
    </View>
  );
};

export default MobileImageComponent;