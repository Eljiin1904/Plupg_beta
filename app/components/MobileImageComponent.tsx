// components/MobileImageComponent.tsx

import React, { useState, useCallback, useEffect } from "react";
import { View, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { images } from '../assets';

interface MobileImageComponentProps {
  source: any;
  className?: string;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fallbackSource?: any;
  showLoadingIndicator?: boolean;
  onError?: (error?: any) => void;
  onLoad?: () => void;
  retryCount?: number;
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
  transition?: number;
  placeholder?: any;
  priority?: "low" | "normal" | "high";
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
  priority = "normal",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Default fallback
  const defaultFallback = fallbackSource || images.plugLogo;

  // Normalize source - less strict validation to maintain compatibility
  const normalizeSource = useCallback((src: any): any => {
    if (!src) {
      console.log('MobileImageComponent: No source provided');
      return null;
    }
    
    // If it's a number (require() result)
    if (typeof src === 'number') {
      return src;
    }
    
    // If it's a string, assume it's a URL and wrap it
    if (typeof src === 'string') {
      // Don't validate URLs strictly - let the Image component handle it
      return { uri: src };
    }
    
    // If it's an object with uri
    if (typeof src === 'object' && src.uri) {
      return src;
    }
    
    // If it's an object without uri (imported image or require())
    if (typeof src === 'object' && !src.uri) {
      return src;
    }
    
    console.log('MobileImageComponent: Unknown source type', typeof src, src);
    return src;
  }, []);

  const [imageSource, setImageSource] = useState<any>(() => normalizeSource(source));

  // Update source when prop changes
  useEffect(() => {
    const newSource = normalizeSource(source);
    setImageSource(newSource);
    
    // Reset states when source changes
    if (newSource) {
      setHasError(false);
      setIsLoading(true);
      setRetryAttempt(0);
    }
  }, [source, normalizeSource]);

  const handleImageError = useCallback((error: any) => {
    console.log('MobileImageComponent: Image load error', {
      source: imageSource,
      retryAttempt,
      error: error?.message || error
    });
    
    // If we have retries left and it's a remote image
    if (retryAttempt < retryCount && imageSource?.uri) {
      console.log(`MobileImageComponent: Retrying (${retryAttempt + 1}/${retryCount})`);
      
      setTimeout(() => {
        setRetryAttempt((prev: number) => prev + 1);
        // Force reload by modifying the URI slightly
        setImageSource((prev: any) => {
          if (prev && typeof prev === 'object' && prev.uri) {
            const separator = prev.uri.includes('?') ? '&' : '?';
            return { ...prev, uri: `${prev.uri}${separator}_retry=${Date.now()}` };
          }
          return prev;
        });
      }, 500);
    } else {
      // No more retries, use fallback
      console.log('MobileImageComponent: Using fallback image');
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
      
      // Set fallback as source
      if (defaultFallback && imageSource !== defaultFallback) {
        const fallbackNormalized = normalizeSource(defaultFallback);
        setImageSource(fallbackNormalized);
        setHasError(false);
        setIsLoading(true);
        setRetryAttempt(0);
      }
    }
  }, [retryAttempt, retryCount, onError, imageSource, defaultFallback, normalizeSource]);

  const handleImageLoad = useCallback(() => {
    console.log('MobileImageComponent: Image loaded successfully', imageSource);
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad, imageSource]);

  // Get container style with proper dimensions
  const getContainerStyle = () => {
    const containerStyle: any = {
      overflow: 'hidden',
    };

    // Copy relevant style properties to container
    if (style && typeof style === 'object' && !Array.isArray(style)) {
      // Copy dimension properties
      ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 
       'borderRadius', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 
       'marginRight', 'backgroundColor'].forEach(prop => {
        if (style[prop] !== undefined) {
          containerStyle[prop] = style[prop];
        }
      });
    }

    // Ensure minimum dimensions on mobile
    if (Platform.OS !== 'web') {
      if (!containerStyle.width && !containerStyle.minWidth) {
        containerStyle.minWidth = 1;
      }
      if (!containerStyle.height && !containerStyle.minHeight) {
        containerStyle.minHeight = 1;
      }
    }

    return containerStyle;
  };

  // Get image style
  const getImageStyle = () => {
    // Start with full size
    let imageStyle: any = {
      width: '100%',
      height: '100%',
    };

    // On mobile, if we have explicit dimensions in style, use them
    if (Platform.OS !== 'web' && style) {
      if (typeof style === 'object' && !Array.isArray(style)) {
        if (style.width) imageStyle.width = style.width;
        if (style.height) imageStyle.height = style.height;
        
        // Copy other visual properties but not layout properties
        ['tintColor', 'opacity', 'transform'].forEach(prop => {
          if (style[prop] !== undefined) {
            imageStyle[prop] = style[prop];
          }
        });
      }
    } else if (style) {
      // On web or with array styles, merge everything
      if (Array.isArray(style)) {
        imageStyle = [imageStyle, ...style];
      } else {
        imageStyle = { ...imageStyle, ...style };
      }
    }

    return imageStyle;
  };

  // Don't render if no source
  if (!imageSource) {
    console.log('MobileImageComponent: Not rendering - no source');
    return null;
  }

  return (
    <View style={getContainerStyle()} className={className}>
      {showLoadingIndicator && isLoading && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#10b981" />
          </View>
        </View>
      )}
      
      <ExpoImage
        source={imageSource}
        style={getImageStyle()}
        contentFit={contentFit}
        onError={handleImageError}
        onLoad={handleImageLoad}
        transition={transition}
        cachePolicy={cachePolicy}
        placeholder={placeholder || { blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        priority={priority}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default MobileImageComponent;