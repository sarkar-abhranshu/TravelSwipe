# TravelSwipe

A React Native travel destination recommender and itinerary planner. Browse destinations with a swipe mechanic — the more you swipe, the better your recommendations get.

## Features

### Implemented
- **Welcome Screen** — Full-screen hero image with a rounded overlay card, app description, and a CTA button navigating to login
- **Login Screen** — Email/password fields with drop shadows, a primary Login button, an OR divider, a Google OAuth button (UI complete with Google logo), and a Sign Up link
- **File-based routing** via Expo Router with headers hidden globally
- **TypeScript** with path aliases (`@/*` maps to project root)

### Planned
- Swipe card deck UI for browsing destinations
- Bottom tab navigation
- Travel itinerary generation screen
- Google OAuth flow (authentication)
- Sign Up screen
- Haptic feedback on swipe
- Recommendation engine (backend)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Router | Expo Router 6 (file-based) |
| Language | TypeScript |
| Gestures | react-native-gesture-handler |
| Animations | react-native-reanimated |
| UI Components | react-native-elements, react-native-drop-shadow |
| Auth | expo-web-browser (OAuth) |

## Project Structure

```
app/
├── _layout.tsx       # Root Stack layout (headers hidden)
├── index.tsx         # / route → WelcomeScreen
└── login.tsx         # /login route → LoginScreen

screens/
├── WelcomeScreen.tsx
└── LoginScreen.tsx

assets/
├── mountain.jpg      # Hero image (WelcomeScreen)
└── google.jpg        # Google OAuth logo (LoginScreen)
```

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the app
   ```bash
   npx expo start
   ```

   Then open in an iOS simulator, Android emulator, or Expo Go.

## Branch History

| Branch | Description |
|---|---|
| `main` / `frontend` | Initial project scaffold |
| `welcomeScreen` | Welcome screen prototype |
| `loginScreen` | Login screen with email/password and OAuth UI |
