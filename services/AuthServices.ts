import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";

// ---------------------------------------------------------------------------
// Native module guard
// ---------------------------------------------------------------------------
// dynamic import() still triggers native registration at module-evaluation
// time and crashes before our catch runs. Synchronous require() inside a
// try/catch is the only reliable way to guard against a missing native module.
// ---------------------------------------------------------------------------
let _googleSignin: any = null;
let _statusCodes: any = null;
let _nativeAvailable: boolean | null = null; // null = not yet checked

const getGoogleModule = (): { GoogleSignin: any; statusCodes: any } => {
  if (_nativeAvailable === null) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("@react-native-google-signin/google-signin");
      _googleSignin = mod.GoogleSignin;
      _statusCodes = mod.statusCodes;
      _nativeAvailable = true;
    } catch {
      _nativeAvailable = false;
    }
  }

  if (!_nativeAvailable || !_googleSignin) {
    throw new Error(
      "Google Sign-In native module is not linked. " +
        "Run `cd ios && pod install && cd ..` then `npx expo run:ios`.",
    );
  }

  return { GoogleSignin: _googleSignin, statusCodes: _statusCodes };
};

// ---------------------------------------------------------------------------
// Configure (called once from AuthContext on mount)
// ---------------------------------------------------------------------------
export const configureGoogleSignin = () => {
  try {
    const { GoogleSignin } = getGoogleModule();
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      scopes: ["profile", "email"],
    });
    console.log("Google Sign-In configured ✓");
  } catch (error) {
    // Native module not linked yet — warn but don't crash the app.
    // Email/password auth will still work fine.
    console.warn("Google Sign-In not available:", (error as Error).message);
  }
};

// ---------------------------------------------------------------------------
// Auth service
// ---------------------------------------------------------------------------
const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

export const authService = {
  async login(identifier: string, password: string) {
    let email = identifier;

    if (!isEmail(identifier)) {
      console.log("Looking up username:", identifier);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier)
        .single();

      if (profileError || !profile) {
        console.error("Username lookup failed:", profileError);
        throw new Error("Username not found");
      }

      email = profile.email;
      console.log("Found email for username:", email);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async signup(email: string, password: string, username?: string) {
    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          name: username,
        },
      },
    });
    if (error) throw new Error(error.message);
    // data.session is null when email confirmation is required
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        email: email,
        username: username,
      });

      if (profileError) {
        console.error("Failed to create profile:", profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
    } else {
      throw new Error("Signup failed - no user created");
    }
    return data;
  },

  async loginWithGoogle() {
    // Will throw a clear error if the native module isn't linked yet
    const { GoogleSignin, statusCodes } = getGoogleModule();

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo?.data?.idToken ?? userInfo?.idToken;

      if (!idToken) throw new Error("No ID token returned from Google.");

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error("Google sign-in was cancelled.");
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error("Google sign-in is already in progress.");
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Google Play Services are not available.");
      }
      // Re-throw our own errors (e.g. "No ID token") unchanged
      throw error;
    }
  },

  async logout() {
    await supabase.auth.signOut();
    // Best-effort Google sign-out so the account picker shows next time
    try {
      const { GoogleSignin } = getGoogleModule();
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) await GoogleSignin.signOut();
    } catch {
      // Native module not available — nothing to do
    }
  },

  async isLoggedIn() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  },

  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  },
};
