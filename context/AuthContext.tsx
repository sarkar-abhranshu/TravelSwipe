import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, configureGoogleSignin } from "@/services/AuthServices";
import { supabase } from "@/utils/supabase";
import { Profile, Preferences } from "@/types/database";

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  preferences: Preferences | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) {
        if (profileError.code !== "PGRST116") {
          throw profileError;
        }
      }
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  const fetchPreferences = async (userId: string) => {
    try {
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (preferencesError) {
        if (preferencesError.code !== "PGRST116") {
          throw preferencesError;
        }
      }
      setPreferences(preferencesData);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setPreferences(null);
    }
  };

  const refreshProfile = async () => {
    if (!user) {
      console.warn("Cannot refresh profile: no user logged in");
      return;
    }
    console.log("🔄 Refreshing profile and preferences...");
    await fetchProfile(user.id);
    await fetchPreferences(user.id);
    console.log("✅ Profile and preferences refreshed");
  };

  useEffect(() => {
    configureGoogleSignin(); // Async but we don't await - it will configure in background
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        await fetchPreferences(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setPreferences(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
        await fetchPreferences(session.user.id);
      }
    } catch (error) {
      throw new Error("Auth check failed" + error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      await authService.login(identifier, password);
      const user = await authService.getUser();
      setUser(user);
      if (user) {
        await fetchProfile(user.id);
        await fetchPreferences(user.id);
      }
      console.log("User logged in", user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const data = await authService.loginWithGoogle();
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user.id);
        await fetchPreferences(data.user.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, username?: string) => {
    const data = await authService.signup(email, password, username);

    if (data.session) {
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user.id);
        await fetchPreferences(data.user.id);
      }
      console.log("User signed up with session:", data.user?.email);
    } else {
      throw new Error("Signup failed - no user data returned");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      setPreferences(null);
    } catch (error) {
      throw new Error("Logout failed" + error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        isLoading,
        login,
        signup,
        logout,
        loginWithGoogle,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
