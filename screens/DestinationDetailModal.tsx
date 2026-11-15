import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.52;

export interface Destination {
  id: string;
  name: string;
  imageUrl: string; // remote URL or require() result
  distanceKm: number;
  tripDurationDays: { min: number; max: number };
  shortDescription: string;
  longDescription: string;
  tags?: string[];
}

interface Props {
  destination: Destination | null;
  visible: boolean;
  onClose: () => void;
}

const MetaPill = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.pillWrapper}>
    <BlurView intensity={60} tint="light" style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </BlurView>
  </View>
);

const DestinationDetailModal = ({ destination, visible, onClose }: Props) => {
  if (!destination) return null;

  const { name, imageUrl, distanceKm, tripDurationDays, shortDescription, longDescription, tags } =
    destination;

  const distanceLabel =
    distanceKm >= 1000
      ? `${(distanceKm / 1000).toFixed(1)} k km`
      : `${distanceKm} km`;
  const durationLabel = `${tripDurationDays.min}–${tripDurationDays.max} days`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* ── Hero image ── */}
          <View style={styles.heroContainer}>
            <Image
              source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Bottom fade-to-white gradient */}
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.72)", "#ffffff"]}
              locations={[0.45, 0.78, 1]}
              style={styles.heroGradient}
            />

            {/* Close button — floating top-left */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <BlurView intensity={55} tint="dark" style={styles.closeBtnBlur}>
                <Text style={styles.closeBtnText}>✕</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* ── Content card ── */}
          <View style={styles.contentCard}>
            <Text style={styles.destinationName}>{name}</Text>

            {/* Frosted-glass meta pills */}
            <View style={styles.metaRow}>
              <MetaPill label="Distance" value={distanceLabel} />
              <MetaPill label="Ideal trip" value={durationLabel} />
            </View>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <View style={styles.tagRow}>
                {tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Descriptions */}
            <Text style={styles.shortDesc}>{shortDescription}</Text>
            <Text style={styles.longDesc}>{longDescription}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },

  // ── Hero ──
  heroContainer: {
    width,
    height: IMAGE_HEIGHT,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: IMAGE_HEIGHT * 0.55,
  },
  closeBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 18,
    borderRadius: 20,
    overflow: "hidden",
  },
  closeBtnBlur: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Content ──
  contentCard: {
    marginTop: -24,
    paddingHorizontal: 22,
    paddingTop: 4,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  destinationName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  // Meta pills
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  pillWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 120,
    backgroundColor: "rgba(240,244,248,0.6)",
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  pillValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  // Tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#e0f2fe",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0369a1",
  },

  // Descriptions
  shortDesc: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    lineHeight: 22,
    marginBottom: 10,
  },
  longDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 28,
  },

  // CTA
  ctaBtn: {
    backgroundColor: "#1877F2",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1877F2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default DestinationDetailModal;
