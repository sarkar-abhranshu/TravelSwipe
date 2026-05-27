import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error with Login, please check your email or password.");
    }
  },
  async signup(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
    if (data.user && !data.session) {
      console.log("Email confirmation required for:", data.user.email);
    }
    return data;
  },
  async logout() {
    await supabase.auth.signOut();
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
