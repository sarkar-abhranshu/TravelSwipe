import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DestinationDetailModal, { Destination } from "./DestinationDetailModal";
import { useAuth } from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");

// ── Placeholder data (replace with your Supabase hook) ──────────────────────
const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Kanchenjunga",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    distanceKm: 1850,
    tripDurationDays: { min: 7, max: 14 },
    shortDescription: "World's 3rd highest mountain peak",
    longDescription:
      "Straddling the border of Sikkim and Nepal, Kanchenjunga rises to 8,586 m and offers some of the most remote trekking routes in the Himalayas. The base camp trek winds through rhododendron forests, glacial moraines, and high-altitude meadows — far less crowded than Everest or Annapurna. The name translates to 'Five Treasures of Snow', referring to its five summits.",
    tags: ["Mountains", "Trekking", "Adventure", "Offbeat"],
  },
  {
    id: "2",
    name: "Hampi",
    imageUrl:
      "https://images.unsplash.com/photo-1587135991058-8816b028691f?w=800",
    distanceKm: 340,
    tripDurationDays: { min: 2, max: 4 },
    shortDescription: "Ruined empire city on a boulder landscape",
    longDescription:
      "Once the capital of the Vijayanagara Empire — one of the wealthiest cities on Earth in the 16th century — Hampi is now a UNESCO World Heritage Site scattered across a surreal landscape of granite boulders and banana plantations. The Virupaksha temple has been in continuous worship for over 1,300 years. Rent a bicycle to cover the spread-out ruins at your own pace.",
    tags: ["History", "Ruins", "UNESCO", "Cycling"],
  },
  {
    id: "3",
    name: "Ziro Valley",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    distanceKm: 2900,
    tripDurationDays: { min: 4, max: 7 },
    shortDescription: "Pine-ringed plateau of the Apatani tribe",
    longDescription:
      "Tucked into the foothills of Arunachal Pradesh, Ziro is a UNESCO-nominated cultural landscape home to the Apatani people, known for their distinctive agrarian traditions and intricate facial tattoos. The valley floor is a patchwork of wet rice paddies and pine-crowned ridges. The annual Ziro Music Festival draws indie artists and travellers seeking something genuinely different.",
    tags: ["Culture", "Offbeat", "Festivals", "Nature"],
  },
];

// ── Swipe thresholds ──────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = width * 0.3;
const ROTATION_FACTOR = 10; // degrees at full throw

// ── Card dimensions — Tinder-style: near full screen ─────────────────────────
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.72;

// ─────────────────────────────────────────────────────────────────────────────

interface DestinationCardProps {
  destination: Destination;
  onImagePress: () => void;
  pan: Animated.ValueXY;
  isTop: boolean;
  stackIndex: number;
}

const DestinationCard = ({
  destination,
  onImagePress,
  pan,
  isTop,
  stackIndex,
}: DestinationCardProps) => {
  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [`-${ROTATION_FACTOR}deg`, "0deg", `${ROTATION_FACTOR}deg`],
    extrapolate: "clamp",
  });

  // Cards behind scale slightly smaller and shift down a touch
  const behindScale = 1 - stackIndex * 0.04;
  const behindTranslateY = stackIndex * 10;

  const cardStyle = isTop
    ? [
        styles.card,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate },
          ],
          zIndex: 10,
        },
      ]
    : [
        styles.card,
        {
          transform: [
            { scale: behindScale },
            { translateY: behindTranslateY },
          ],
          zIndex: 10 - stackIndex,
        },
      ];

  const durationLabel = `${destination.tripDurationDays.min}–${destination.tripDurationDays.max} days`;
  const distanceLabel =
    destination.distanceKm >= 1000
      ? `${(destination.distanceKm / 1000).toFixed(1)} k km`
      : `${destination.distanceKm} km`;

  return (
    <Animated.View style={cardStyle}>
      {/* Full-bleed image — tappable to open detail */}
      <TouchableOpacity
        activeOpacity={0.97}
        onPress={onImagePress}
        style={StyleSheet.absoluteFill}
      >
        <Image
          source={
            typeof destination.imageUrl === "string"
              ? { uri: destination.imageUrl }
              : destination.imageUrl
          }
          style={styles.cardImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Bottom gradient scrim + text overlay */}
      <View style={styles.scrim} pointerEvents="none">
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.78)"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{destination.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Distance</Text>
              <Text style={styles.metaValue}>{distanceLabel}</Text>
            </View>
            <View style={styles.metaSep} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Ideal Trip</Text>
              <Text style={styles.metaValue}>{durationLabel}</Text>
            </View>
          </View>

          <Text style={styles.shortDesc} numberOfLines={2}>
            {destination.shortDescription}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const HomeScreen = () => {
  const { user, profile } = useAuth();
  const [destinations] = useState<Destination[]>(MOCK_DESTINATIONS);
  const [currentIndexRef] = useState({ current: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalDestination, setModalDestination] = useState<Destination | null>(null);

  const pan = useRef(new Animated.ValueXY()).current;

  const updateIndex = useCallback(
    (newIndex: number) => {
      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
    },
    [currentIndexRef],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),

      onPanResponderRelease: (_e, gestureState) => {
        const { dx } = gestureState;

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          // Fling off screen
          Animated.timing(pan, {
            toValue: { x: dx > 0 ? width * 1.5 : -width * 1.5, y: gestureState.dy },
            duration: 220,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            updateIndex(currentIndexRef.current + 1);
          });
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 6,
          }).start();
        }
      },
    }),
  ).current;

  const displayName =
    profile?.username || user?.user_metadata?.name || "Traveller";

  const avatarInitial = displayName[0]?.toUpperCase() ?? "T";

  const visibleCards = destinations.slice(currentIndex, currentIndex + 3);
  const allSwiped = currentIndex >= destinations.length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {displayName.split(" ")[0]} 👋</Text>
          <Text style={styles.subGreeting}>Where to next?</Text>
        </View>
        {/* Avatar — replace Image src with real avatar URL if available */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </View>
      </View>

      {/* ── Card deck ── */}
      <View style={styles.deckContainer}>
        {allSwiped ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyTitle}>You've seen everything!</Text>
            <Text style={styles.emptyBody}>
              More destinations are loading…
            </Text>
          </View>
        ) : (
          // Render back-to-front so top card is visually on top
          [...visibleCards].reverse().map((dest, reversedIdx) => {
            const stackIndex = visibleCards.length - 1 - reversedIdx;
            const isTop = stackIndex === 0;
            return (
              <DestinationCard
                key={dest.id}
                destination={dest}
                isTop={isTop}
                stackIndex={stackIndex}
                pan={isTop ? pan : new Animated.ValueXY()}
                onImagePress={() => isTop && setModalDestination(dest)}
                {...(isTop ? panResponder.panHandlers : {})}
              />
            );
          })
        )}
      </View>

      {/* ── Swipe hint ── */}
      {!allSwiped && (
        <View style={styles.hintRow}>
          <Text style={styles.hint}>← swipe to skip · tap photo for details →</Text>
        </View>
      )}

      {/* ── Detail Modal ── */}
      <DestinationDetailModal
        destination={modalDestination}
        visible={!!modalDestination}
        onClose={() => setModalDestination(null)}
      />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 44,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  subGreeting: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  // Deck
  deckContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  // Card — full-height, image fills everything, text floats over gradient
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  // gradient scrim sits over the image at the bottom
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: CARD_HEIGHT * 0.48,
    justifyContent: "flex-end",
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metaItem: {
    flex: 1,
  },
  metaSep: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 14,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  shortDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 19,
  },

  // Hint
  hintRow: {
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    alignItems: "center",
  },
  hint: {
    fontSize: 12,
    color: "#94a3b8",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});

export default HomeScreen;
