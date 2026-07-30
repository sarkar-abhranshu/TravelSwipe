# 🌍 TravelSwipe

**Swipe your way to your next adventure!**

TravelSwipe is a modern React Native mobile application built with Expo that helps users discover and explore travel destinations through an intuitive swipe-based interface. Think Tinder, but for travel destinations!

---

## 📱 Project Description

TravelSwipe revolutionizes the way people discover travel destinations by providing a fun, engaging swipe interface. Users can browse through curated travel destinations, set their preferences, and find their perfect next vacation spot with just a swipe.

Built with modern technologies including:
- **React Native** & **Expo** for cross-platform mobile development
- **TypeScript** for type-safe code
- **Supabase** for authentication and backend services
- **Google Sign-In** for seamless OAuth authentication
- **Expo Router** for file-based navigation

---

## ✨ Current Features

### 🔐 Authentication
- **Email/Password Login & Signup** with username support
- **Google OAuth** integration for one-tap sign-in
- **Username or Email login** - Users can log in with either their username or email
- Secure authentication powered by Supabase Auth
- Persistent sessions with AsyncStorage

### 🎯 User Experience
- **Onboarding Flow** - Smooth welcome experience for new users
- **Preferences Screen** - Customize your travel preferences
- **Vibe Screen** - Set your travel mood and style
- **Swipe Interface** - Discover destinations with an intuitive swipe UI
- **User Profiles** - Personalized user profiles with username and metadata

### 🏗️ Technical Features
- **Type-safe routing** with Expo Router
- **Native module guards** for graceful degradation when native modules aren't available
- **Cross-platform support** (iOS & Android)
- **Location services** integration
- **Haptic feedback** for enhanced user experience
- **Modern UI** with React Native Paper and custom components

---

## 🎥 Project Demo

Check out TravelSwipe in action:

![TravelSwipe Demo](https://github.com/user-attachments/assets/a58a1852-5a51-4414-a8ab-eaa2044b9ac6)

*Experience the smooth swipe interface and intuitive authentication flow*

---

## 🚀 How to Install and Check It Out Yourself

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (Mac only) or **Android Studio** with emulator
- **Supabase account** (free tier works great!)
- **Google Cloud Console account** (for OAuth)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/TravelSwipe.git
cd TravelSwipe
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Supabase Configuration

#### a. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (this takes ~2 minutes)

#### b. Set Up Authentication
1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Copy your **Project URL** and **anon/public** key

#### c. Create Database Tables
Run this SQL in your Supabase SQL Editor to create all required tables:

##### 1. Profiles Table
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferences_completed BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create the username lookup function
CREATE OR REPLACE FUNCTION get_email_from_username(lookup_username TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT email
    FROM auth.users
    WHERE raw_user_meta_data->>'username' = lookup_username
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

##### 2. Preferences Table
```sql
-- Create preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_when_in_use_permission BOOLEAN DEFAULT FALSE,
  location JSONB DEFAULT '{"latitude": 0, "longitude": 0}'::jsonb,
  close_dest BOOLEAN DEFAULT TRUE,
  trip_duration INTEGER DEFAULT 3,
  preferred_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for preferences
CREATE POLICY "Users can view their own preferences"
  ON preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON preferences(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

##### 3. Destination Table
```sql
-- Create destination table
CREATE TABLE IF NOT EXISTS destination (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  short_description TEXT,
  full_description TEXT,
  country TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  trip_duration_min INTEGER DEFAULT 1,
  trip_duration_max INTEGER DEFAULT 7,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (everyone can read destinations)
ALTER TABLE destination ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view destinations
CREATE POLICY "Anyone can view destinations"
  ON destination FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_destination_country ON destination(country);
CREATE INDEX IF NOT EXISTS idx_destination_tags ON destination USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_destination_duration ON destination(trip_duration_min, trip_duration_max);

-- Insert some sample destinations (optional)
INSERT INTO destination (name, country, short_description, full_description, tags, trip_duration_min, trip_duration_max, latitude, longitude, image_url)
VALUES 
  ('Bali', 'Indonesia', 'Tropical paradise with beaches and culture', 'Bali is a stunning Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.', ARRAY['beach', 'culture', 'adventure', 'relaxation'], 5, 10, -8.3405, 115.0920, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'),
  ('Tokyo', 'Japan', 'Vibrant metropolis blending tradition and tech', 'Tokyo, Japan''s bustling capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.', ARRAY['city', 'culture', 'food', 'tech'], 4, 7, 35.6762, 139.6503, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'),
  ('Santorini', 'Greece', 'Iconic white-washed buildings and sunsets', 'Santorini is one of the Cyclades islands in the Aegean Sea, famous for dramatic views, stunning sunsets and white-washed houses.', ARRAY['beach', 'romantic', 'relaxation', 'culture'], 3, 5, 36.3932, 25.4615, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e'),
  ('Iceland', 'Iceland', 'Land of fire and ice with natural wonders', 'Iceland is a Nordic island nation with dramatic landscapes including volcanoes, geysers, hot springs and lava fields.', ARRAY['adventure', 'nature', 'photography'], 5, 10, 64.9631, -19.0208, 'https://images.unsplash.com/photo-1504829857797-ddff29c27927'),
  ('Paris', 'France', 'The City of Light and romance', 'Paris, France''s capital, is a major European city known for its art, fashion, gastronomy and culture. The iconic Eiffel Tower defines its skyline.', ARRAY['city', 'romantic', 'culture', 'food', 'art'], 3, 7, 48.8566, 2.3522, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34')
ON CONFLICT DO NOTHING;
```

#### d. Configure Google OAuth in Supabase
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. You'll add the Client ID and Secret after setting up Google Console (next step)

### 4️⃣ Google Cloud Console Configuration

#### a. Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one

#### b. Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it

#### c. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields:
   - App name: `TravelSwipe`
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email` and `profile`
5. Save and continue

#### d. Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**

**For iOS:**
- Application type: **iOS**
- Bundle ID: `com.absarkar.travelswipe` (or your custom bundle ID)
- Copy the generated **iOS Client ID**

**For Android:**
- Application type: **Android**
- Package name: `com.absarkar.travelswipe`
- Get SHA-1 certificate fingerprint:
  ```bash
  # For debug builds
  keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
  # Password: android
  ```
- Paste the SHA-1 fingerprint
- Copy the generated **Android Client ID**

**For Web (required for Supabase):**
- Application type: **Web application**
- Name: `TravelSwipe Web`
- Authorized redirect URIs: Add your Supabase callback URL:
  ```
  https://your-project-ref.supabase.co/auth/v1/callback
  ```
- Copy the **Web Client ID** and **Client Secret**

#### e. Add credentials to Supabase
1. Go back to Supabase → **Authentication** → **Providers** → **Google**
2. Paste your **Web Client ID** and **Client Secret**
3. Save

### 5️⃣ Environment Variables

Create a `.env` file in the root of your project:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

### 6️⃣ Update Bundle Identifier (Optional)

If you want to use your own bundle identifier:

1. Update `app.json`:
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourname.travelswipe"
       },
       "android": {
         "package": "com.yourname.travelswipe"
       }
     }
   }
   ```

2. Update the Google OAuth URL scheme in `app.json` → `ios.infoPlist.CFBundleURLTypes`

### 7️⃣ Run the App

#### For iOS (Mac only):

```bash
# First time only: install native modules
npx expo run:ios

# Or use Expo Go for development (no Google Sign-In)
npx expo start
```

#### For Android:

```bash
# First time only: install native modules
npx expo run:android

# Or use Expo Go for development (no Google Sign-In)
npx expo start
```

#### For Development:

```bash
# Start Metro bundler
npm start

# Then press 'i' for iOS simulator or 'a' for Android emulator
```

### 8️⃣ Testing the App

1. **Create an account** using email/password signup with a username
2. **Log out** and try logging in with your **email**
3. **Log out** again and try logging in with your **username**
4. Try **Google Sign-In** for seamless authentication
5. Explore the **Preferences** and **Vibe** screens
6. Start swiping through destinations!

---

## 🛠️ Project Structure

```
TravelSwipe/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Welcome screen
│   ├── login.tsx          # Login page
│   ├── signup.tsx         # Signup page
│   ├── onboarding.tsx     # Onboarding flow
│   ├── preferences.tsx    # User preferences
│   ├── vibescreen.tsx     # Travel vibe selection
│   └── home.tsx           # Main swipe interface
├── screens/               # Screen components
├── components/            # Reusable UI components
├── services/              # API and auth services
│   └── authService.ts     # Authentication logic
├── context/               # React Context providers
├── utils/                 # Utility functions
│   └── supabase.ts        # Supabase client
├── types/                 # TypeScript type definitions
├── constants/             # App constants
└── assets/                # Images, fonts, etc.
```

---

## 🔧 Troubleshooting

### Google Sign-In Not Working?

**Issue:** "Google Sign-In native module is not linked"

**Solution:**
```bash
# Rebuild the native app
cd ios
pod install
cd ..
npx expo run:ios

# For Android
npx expo run:android
```

### Username Login Not Working?

**Issue:** "Username not found"

**Solution:** Make sure you've created the `get_email_from_username` SQL function in Supabase (see step 3c above).

### Environment Variables Not Loading?

**Solution:** 
- Restart the Metro bundler after changing `.env`
- Use `EXPO_PUBLIC_` prefix for all variables you want to access client-side
- Never commit `.env` to git (it's in `.gitignore`)

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2026 Abhishek Sarkar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments & Thanks

Special thanks to:

- **[Supabase](https://supabase.com)** - For providing an amazing open-source Firebase alternative
- **[Expo](https://expo.dev)** - For making React Native development a breeze
- **[React Native Community](https://reactnative.dev)** - For the incredible ecosystem
- **Google** - For the Google Sign-In SDK
- **All contributors** - Thank you for making this project better!

### Built With Love ❤️

This project was built with passion for travel and technology. If you enjoyed using TravelSwipe or found the code helpful, please consider:

- ⭐ **Starring the repository**
- 🐛 **Reporting issues** you encounter
- 💡 **Suggesting new features**
- 🤝 **Contributing** to the project

---

## 📞 Contact & Support

- **Developer:** Abhranshu Sarkar
- **GitHub:** [@sarkar-abhranshu](https://github.com/sarkar-abhranshu)
- **Email:** abhranshusarkar@outlook.com

For bugs and feature requests, please open an issue on GitHub.

---

**Happy Swiping! 🌴✈️🌎**

*Made with ☕ and 💻*
