import { scoreDestination } from "./tagScoring";
import { Destination, Preferences } from "../types/database";

// --- Fixture destinations ---
const destA: Destination = {
  id: "a",
  name: "Mountain Trail",
  image_url: null,
  short_description: "A mountain trail",
  full_description: "A mountain trail in Uttarakhand",
  country: "India",
  tags: ["mountains", "trekking", "offbeat"],
  trip_duration_min: 3,
  trip_duration_max: 5,
  latitude: 30.09,
  longitude: 78.26, // ~300km from Bangalore
};

const destB: Destination = {
  id: "b",
  name: "High Altitude Trek",
  image_url: null,
  short_description: "A high altitude trek",
  full_description: "A high altitude trek in Ladakh",
  country: "India",
  tags: ["mountains", "trekking", "camping", "high-altitude"],
  trip_duration_min: 7,
  trip_duration_max: 12,
  latitude: 34.15,
  longitude: 77.57, // ~1800km from Bangalore (Ladakh)
};

const destC: Destination = {
  id: "c",
  name: "Beach Getaway",
  image_url: null,
  short_description: "A beach getaway",
  full_description: "A beach getaway in Andaman",
  country: "India",
  tags: ["beach", "islands"],
  trip_duration_min: 3,
  trip_duration_max: 5,
  latitude: 11.74,
  longitude: 92.65, // ~250km from Bangalore (Andaman)
};

const destD: Destination = {
  id: "d",
  name: "Mountain Camp",
  image_url: null,
  short_description: "A mountain camp",
  full_description: "A mountain camp in Manali",
  country: "India",
  tags: ["mountains", "trekking", "camping"],
  trip_duration_min: 3,
  trip_duration_max: 5,
  latitude: 32.24,
  longitude: 77.18, // ~900km from Bangalore (Manali)
};

// Bangalore coordinates
const userLat = 12.97;
const userLon = 77.59;

// --- Fixture users ---
const shortClose: Preferences = {
  user_id: "u1",
  tripDuration: "short",
  farDest: false,
  preferredTags: ["mountains", "trekking", "camping"],
  location: { latitude: userLat, longitude: userLon },
  locationWhenInUsePermission: true,
};

const longFar: Preferences = {
  ...shortClose,
  user_id: "u2",
  tripDuration: "long",
  farDest: true,
};

const longClose: Preferences = {
  ...shortClose,
  user_id: "u3",
  tripDuration: "long",
  farDest: false,
};

const shortFar: Preferences = {
  ...shortClose,
  user_id: "u4",
  tripDuration: "short",
  farDest: true,
};

// --- Run ---
const dests = [destA, destB, destC, destD];
const users = [
  { label: "short + close", prefs: shortClose },
  { label: "long  + far  ", prefs: longFar },
  { label: "long  + close", prefs: longClose },
  { label: "short + far  ", prefs: shortFar },
];

users.forEach(({ label, prefs }) => {
  const ranked = [...dests]
    .map(d => ({
      name: d.name,
      score: scoreDestination(d, prefs, userLat, userLon),
    }))
    .sort((a, b) => b.score - a.score);

  console.log(`\n${label}:`);
  ranked.forEach(r => console.log(`  ${r.score}  ${r.name}`));
});
