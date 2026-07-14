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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Key_Monastery_Spiti_Valley.jpg/1280px-Key_Monastery_Spiti_Valley.jpg",
    tags: ["mountains", "trekking", "high-altitude", "camping"],
  },
  {
    id: "beach-bum",
    name: "Beach Bum",
    emoji: "🏖️",
    description: "You love everything about beaches — the sound, the salt, and the slow pace",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Radhanagar_Beach_Andaman.jpg/1280px-Radhanagar_Beach_Andaman.jpg",
    tags: ["beach", "islands", "water-sports", "relaxation"],
  },
  {
    id: "history-buff",
    name: "History Buff",
    emoji: "🏛️",
    description: "You love places with deep lore — ruins, forts, and stories carved in stone",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Virupaksha_Temple_Hampi.jpg/1280px-Virupaksha_Temple_Hampi.jpg",
    tags: ["heritage", "history", "temples", "architecture"],
  },
  {
    id: "nature-lover",
    name: "Nature Lover",
    emoji: "🌿",
    description: "Forests, wildlife, and open skies — you'd rather be outdoors than anywhere else",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/One_Horned_Rhinoceros_Kaziranga.jpg/1280px-One_Horned_Rhinoceros_Kaziranga.jpg",
    tags: ["nature", "wildlife", "safari", "forests"],
  },
  {
    id: "slow-traveller",
    name: "Slow Traveller",
    emoji: "🧘",
    description: "You travel to reset — ashrams, quiet coastlines, and places that ask nothing of you",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Laxman_Jhula_Rishikesh.jpg/1280px-Laxman_Jhula_Rishikesh.jpg",
    tags: ["spiritual", "yoga", "ayurveda", "relaxation"],
  },
  {
    id: "offbeat-explorer",
    name: "Offbeat Explorer",
    emoji: "🗺️",
    description: "You go where the maps get vague — hidden valleys, forgotten towns, roads less taken",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Living_root_bridge_Meghalaya.jpg/1280px-Living_root_bridge_Meghalaya.jpg",
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
