import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Image as RNImage } from "react-native";
import { Asset } from "expo-asset";

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
  [key: string]: any;
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
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);
  const [mounted, setMounted] = useState(true);

  // Default fallback to app logo
  const defaultFallback = require("../../assets/images/the-plug-logo.jpg");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageError = async () => {
    if (!mounted) return;

    console.warn(
      "Image failed to load:",
      source?.uri || source || "unknown source",
    );

    if (retries < retryCount) {
      setRetries((prev) => prev + 1);
      setIsLoading(true);
      setImageError(false);
      return;
    }

    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    if (!mounted) return;
    setIsLoading(false);
    setRetries(0);
    onLoad?.();
  };

  // Improved source detection logic
  const isLocalAsset =
    source &&
    typeof source === "object" &&
    !source.uri &&
    (typeof source === "number" || source.__packager_asset);

  const isExternalURL =
    source &&
    (typeof source === "string" ||
      (typeof source === "object" &&
        source.uri &&
        typeof source.uri === "string"));

  // Use fallback if image failed to load
  if (imageError) {
    const fallback = fallbackSource || defaultFallback;

    return (
      <RNImage
        source={fallback}
        style={[{ width: "100%", height: "100%" }, style]}
        resizeMode={contentFit}
        onError={() => console.warn("Fallback image failed to load")}
        {...props}
      />
    );
  }

  // Local assets: Use React Native Image (more reliable on mobile)
  if (isLocalAsset) {
    if (Platform.OS === "web") {
      try {
        const resolvedAsset = Asset.fromModule(source).uri;
        if (resolvedAsset) {
          return (
            <ExpoImage
              source={{ uri: resolvedAsset }}
              className={className}
              style={style}
              contentFit={contentFit}
              onError={handleImageError}
              onLoad={handleImageLoad}
              cachePolicy="memory-disk"
              {...props}
            />
          );
        }
      } catch (error) {
        console.warn("Failed to resolve web asset:", error);
        return (
          <View
            className={className}
            style={[
              {
                width: "100%",
                height: "100%",
                backgroundColor: "#222",
                alignItems: "center",
                justifyContent: "center",
              },
              style,
            ]}
          >
            <Text style={{ color: "#888", fontSize: 12, textAlign: "center" }}>
              Image not available on web
            </Text>
          </View>
        );
      }
    }

    return (
      <RNImage
        source={source}
        style={[{ width: "100%", height: "100%" }, style]}
        resizeMode={contentFit}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
    );
  }

  // External URLs: Use expo-image with mobile optimizations
  if (isExternalURL) {
    return (
      <View className="relative">
        <ExpoImage
          source={typeof source === "string" ? { uri: source } : source}
          className={className}
          style={style}
          contentFit={contentFit}
          onError={handleImageError}
          onLoad={handleImageLoad}
          transition={300}
          cachePolicy="memory-disk"
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          {...props}
        />
        {isLoading && showLoadingIndicator && (
          <View className="absolute inset-0 items-center justify-center bg-gray-800/50">
            <ActivityIndicator size="small" color="#4AFF00" />
          </View>
        )}
      </View>
    );
  }

  // Emergency fallback: Use default logo
  console.warn(
    "MobileImageComponent: Using emergency fallback for source:",
    source,
  );
  return (
    <RNImage
      source={defaultFallback}
      style={[{ width: "100%", height: "100%" }, style]}
      resizeMode={contentFit}
      onError={() => console.warn("Emergency fallback failed to load")}
      {...props}
    />
  );
};

export default MobileImageComponent;
