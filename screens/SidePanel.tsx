import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Platform,
  Image,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// Panel takes up 72% of screen width, slides in from the right
const PANEL_WIDTH = width * 0.72;
const DISMISS_THRESHOLD = PANEL_WIDTH * 0.35; // how far right to drag before it closes

export interface PanelItem {
  key: string;
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SidePanel = ({ visible, onClose }: Props) => {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  // Slide value: 0 = fully open (translated 0), PANEL_WIDTH = fully hidden (off right edge)
  const slideX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // ── Open / close animation ──────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 20,
          tension: 180,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: PANEL_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // ── Back-swipe to dismiss ──────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      // Only claim horizontal rightward drags
      onMoveShouldSetPanResponder: (_e, gs) => gs.dx > 8 && Math.abs(gs.dy) < 40,
      onMoveShouldSetPanResponderCapture: (_e, gs) =>
        gs.dx > 8 && Math.abs(gs.dy) < 40,
      onPanResponderTerminationRequest: () => false,

      onPanResponderMove: (_e, gs) => {
        // Only allow dragging right (positive dx)
        const clampedX = Math.max(0, gs.dx);
        slideX.setValue(clampedX);
        // Fade backdrop as user drags
        const progress = 1 - clampedX / PANEL_WIDTH;
        backdropOpacity.setValue(Math.max(0, progress));
      },

      onPanResponderRelease: (_e, gs) => {
        if (gs.dx > DISMISS_THRESHOLD || gs.vx > 0.5) {
          // Fling closed
          Animated.parallel([
            Animated.timing(slideX, {
              toValue: PANEL_WIDTH,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 160,
              useNativeDriver: true,
            }),
          ]).start(onClose);
        } else {
          // Snap back open
          Animated.parallel([
            Animated.spring(slideX, {
              toValue: 0,
              useNativeDriver: true,
              friction: 20,
              tension: 180,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  // ── Nav items ────────────────────────────────────────────────────────────
  const displayName =
    profile?.username || user?.user_metadata?.name || "Traveller";
  const email = profile?.email || user?.email || "";
  const avatarInitial = displayName[0]?.toUpperCase() ?? "T";

  const navItems: PanelItem[] = [
    {
      key: "profile",
      icon: "👤",
      label: "Profile",
      onPress: () => { onClose(); router.push("/profile"); },
    },
    {
      key: "spots",
      icon: "❤️",
      label: "Selected Spots",
      onPress: () => { onClose(); router.push("/selected-spots"); },
    },
    {
      key: "itineraries",
      icon: "🗺️",
      label: "My Itineraries",
      onPress: () => { onClose(); router.push("/itineraries"); },
    },
    {
      key: "preferences",
      icon: "🎯",
      label: "Travel Preferences",
      onPress: () => { onClose(); router.push("/preferences"); },
    },
    {
      key: "settings",
      icon: "⚙️",
      label: "Settings",
      onPress: () => { onClose(); router.push("/settings"); },
    },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents={visible ? "auto" : "none"}>
      {/* ── Backdrop ── */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* ── Panel ── */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Profile header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{avatarInitial}</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail} numberOfLines={1}>{email}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Nav items */}
        <View style={styles.navList}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, item.danger && styles.navLabelDanger]}>
                {item.label}
              </Text>
              <Text style={styles.navChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Log out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            onClose();
            await logout();
            router.replace("/login");
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Drag handle — visual cue for back-swipe */}
        <View style={styles.dragHandle} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  panel: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    paddingTop: Platform.OS === "ios" ? 64 : 48,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    shadowColor: "#000",
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 20,
    justifyContent: "space-between",
  },

  // Drag handle on the left edge of the panel
  dragHandle: {
    position: "absolute",
    left: 10,
    top: "50%",
    width: 4,
    height: 40,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginTop: -20,
  },

  // Profile section
  profileSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "flex-start",
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#1877F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLargeText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748b",
    maxWidth: PANEL_WIDTH - 48,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 20,
    marginVertical: 8,
  },

  // Nav
  navList: {
    paddingTop: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  navIcon: {
    fontSize: 18,
    width: 32,
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  navLabelDanger: {
    color: "#dc2626",
  },
  navChevron: {
    fontSize: 18,
    color: "#cbd5e1",
    fontWeight: "300",
  },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 4,
  },
  logoutIcon: {
    fontSize: 18,
    width: 32,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#dc2626",
  },
});

export default SidePanel;
