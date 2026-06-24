import { supabase } from "@/utils/supabase";

export const DestinationServices = {
  async getDestinations() {
    const { data, error } = await supabase.from("destinations").select("*");
    if (error) throw error;
    return data;
  },
};
