export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export const VIBES: Vibe[] = [
  {
    id: "adventure-seeker",
    name: "Adventure Seeker",
    emoji: "🏔️",
    description: "You live for the thrill of high passes, hard trails, and sleeping under the stars",
    imageUrl:
      "https://images.unsplash.com/photo-1606053080680-5f74eca7c8cd?fm=jpg&q=80&w=1280&auto=format&fit=crop",
    tags: ["mountains", "trekking", "high-altitude", "camping"],
  },
  {
    id: "beach-bum",
    name: "Beach Bum",
    emoji: "🏖️",
    description: "You love everything about beaches — the sound, the salt, and the slow pace",
    imageUrl:
      "https://images.unsplash.com/photo-1566323124805-757e5c41d37c?fm=jpg&q=80&w=1280&auto=format&fit=crop",
    tags: ["beach", "islands", "water-sports", "relaxation"],
  },
  {
    id: "history-buff",
    name: "History Buff",
    emoji: "🏛️",
    description: "You love places with deep lore — ruins, forts, and stories carved in stone",
    imageUrl:
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=1348&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["heritage", "history", "temples", "architecture"],
  },
  {
    id: "nature-lover",
    name: "Nature Lover",
    emoji: "🌿",
    description: "Forests, wildlife, and open skies — you'd rather be outdoors than anywhere else",
    imageUrl:
      "https://images.unsplash.com/photo-1723745390402-04eeda8b6444?fm=jpg&q=80&w=1280&auto=format&fit=crop",
    tags: ["nature", "wildlife", "safari", "forests"],
  },
  {
    id: "slow-traveller",
    name: "Slow Traveller",
    emoji: "🧘",
    description: "You travel to reset — ashrams, quiet coastlines, and places that ask nothing of you",
    imageUrl:
      "https://images.unsplash.com/photo-1691735214703-310c6594c6a8?q=80&w=2346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["spiritual", "yoga", "ayurveda", "relaxation"],
  },
  {
    id: "offbeat-explorer",
    name: "Offbeat Explorer",
    emoji: "🗺️",
    description: "You go where the maps get vague — hidden valleys, forgotten towns, roads less taken",
    imageUrl:
      "https://images.unsplash.com/photo-1566376011138-ce2c615e7701?fm=jpg&q=80&w=1280&auto=format&fit=crop",
    tags: ["offbeat", "northeast-india", "unique", "adventure"],
  },
];

// Maps a list of selected vibe IDs to a deduplicated flat array of tags
// Use this in VibePickerScreen when writing to Supabase
export const resolveTagsFromVibes = (selectedVibeIds: string[]): string[] => {
  const tagSet = new Set<string>();
  selectedVibeIds.forEach((id) => {
    const vibe = VIBES.find((v) => v.id === id);
    vibe?.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
};
