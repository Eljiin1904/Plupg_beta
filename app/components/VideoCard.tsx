import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import MobileImageComponent from "./MobileImageComponent";
import { ExploreVideo } from "../data/mockExploreVideos";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VideoCardProps {
  video: ExploreVideo;
  isActive: boolean;
  onOrderNow: (restaurantId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  onOrderNow,
}) => {
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const isMounted = useRef(true);
  const playerRef = useRef<any>(null);
  const isInitialMount = useRef(true);

  // Initialize player with basic settings only
  const player = useVideoPlayer(video.videoUrl, (player) => {
    try {
      if (isMounted.current && player) {
        console.log("Initial player setup for video:", video.id);
        player.loop = true;
        player.muted = isMuted;
        player.volume = 1.0;
        playerRef.current = player;
      }
    } catch (error) {
      console.error("Error initializing player for video:", video.id, error);
    }
  });

  // Single source of truth for managing playback
  const handlePlayback = useCallback(async () => {
    if (!isMounted.current || !playerRef.current) return;

    try {
      if (isActive && playerRef.current.status === "readyToPlay") {
        console.log("Starting playback for video:", video.id);
        if (playerRef.current.play) {
          await playerRef.current.play();
          setIsVideoReady(true);
        }
      } else if (!isActive && playerRef.current) {
        console.log("Pausing playback for video:", video.id);
        // Only pause if the player is actually playing
        if (playerRef.current.playing && playerRef.current.pause) {
          playerRef.current.pause();
        }
        if (playerRef.current.currentTime !== undefined) {
          playerRef.current.currentTime = 0;
        }
        setIsVideoReady(false);
      }
    } catch (error) {
      console.error("Playback control error for video:", video.id, error);
    }
  }, [isActive, video.id]);

  // Handle active state changes with debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log(
      "Active state changed for video:",
      video.id,
      "isActive:",
      isActive,
    );

    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        handlePlayback();
      }
    }, 300); // Add debounce to prevent rapid state changes

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isActive, handlePlayback, video.id]);

  // Listen for player status changes
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.addListener) return;

    try {
      const subscription = playerRef.current.addListener(
        "statusChange",
        ({ status, error }) => {
          if (!isMounted.current) return;

          console.log(
            "Player status changed for video:",
            video.id,
            "status:",
            status,
          );

          switch (status) {
            case "readyToPlay":
              setIsLoading(false);
              if (isActive) {
                handlePlayback();
              }
              break;

            case "loading":
              setIsLoading(true);
              setIsVideoReady(false);
              break;

            case "error":
              console.error("Player error for video:", video.id, error);
              setIsLoading(false);
              setIsVideoReady(false);
              break;

            default:
              break;
          }
        },
      );

      return () => {
        if (subscription && subscription.remove) {
          subscription.remove();
        }
      };
    } catch (error) {
      console.error(
        "Error setting up player listener for video:",
        video.id,
        error,
      );
    }
  }, [video.id, isActive, handlePlayback]);

  // Handle mute state changes
  useEffect(() => {
    if (isMounted.current && playerRef.current) {
      try {
        if (playerRef.current.muted !== undefined) {
          playerRef.current.muted = isMuted;
        }
      } catch (error) {
        console.error("Error setting mute state for video:", video.id, error);
      }
    }
  }, [isMuted, video.id]);

  // Cleanup
  useEffect(() => {
    return () => {
      console.log("Component unmounting for video:", video.id);
      isMounted.current = false;
      playerRef.current = null;
    };
  }, [video.id]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setLiked(!liked);

  return (
    <View style={styles.container}>
      {/* Show thumbnail until video is ready and active */}
      {(!isActive || !isVideoReady) && (
        <Image
          style={styles.poster}
          source={{ uri: video.thumbnailUrl }}
          contentFit="cover"
        />
      )}

      {/* Only render video if this card is active */}
      {isActive && (
        <VideoView
          player={player}
          style={[styles.video, { opacity: isVideoReady ? 1 : 0 }]}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {/* Loading indicator */}
      {isActive && isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {/* UI Overlay */}
      <View style={styles.overlay}>
        <View style={styles.gradient} />
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Heart
              size={28}
              color={liked ? "#FF3008" : "#FFFFFF"}
              fill={liked ? "#FF3008" : "transparent"}
            />
            <Text style={styles.actionText}>
              {formatNumber(liked ? video.stats.likes + 1 : video.stats.likes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>
              {formatNumber(video.stats.comments)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>
              {formatNumber(video.stats.shares)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onOrderNow(video.restaurant.id)}
          >
            <View style={styles.orderButton}>
              <ShoppingBag size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Order</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContent}>
          <View style={styles.userContainer}>
            <MobileImageComponent
              source={{ uri: video.user.avatar }}
              style={styles.userAvatar}
              contentFit="cover"
            />
            <Text style={styles.username}>{video.user.username}</Text>
          </View>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {video.description}
          </Text>
          <TouchableOpacity
            style={styles.restaurantContainer}
            onPress={() => onOrderNow(video.restaurant.id)}
          >
            <MobileImageComponent
              source={{ uri: video.restaurant.logo }}
              style={styles.restaurantLogo}
              contentFit="cover"
            />
            <View>
              <Text style={styles.restaurantName}>{video.restaurant.name}</Text>
              <Text style={styles.deliveryInfo}>
                {video.restaurant.deliveryTime} • {video.restaurant.deliveryFee}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
          {isMuted ? (
            <VolumeX size={20} color="#FFFFFF" />
          ) : (
            <Volume2 size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: Platform.OS === "web" ? SCREEN_HEIGHT - 80 : SCREEN_HEIGHT,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    ...(Platform.OS === "web"
      ? {
          transition: "opacity 0.3s ease-in-out",
        }
      : {}),
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    padding: 16,
    justifyContent: "flex-end",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
  },
  rightActions: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "web" ? 120 : 100,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: {
    color: "#FFFFFF",
    marginTop: 6,
    fontSize: 12,
  },
  orderButton: {
    backgroundColor: "#4AFF00",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContent: {
    alignSelf: "flex-start",
    paddingBottom: Platform.OS === "web" ? 60 : 40,
    paddingRight: "25%",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  username: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  videoTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  videoDescription: {
    color: "#EEEEEE",
    fontSize: 14,
    marginBottom: 12,
  },
  restaurantContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  restaurantLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  restaurantName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  deliveryInfo: {
    color: "#CCCCCC",
    fontSize: 12,
  },
  muteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});

export default React.memo(VideoCard);
