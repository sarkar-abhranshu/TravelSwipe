import { Destination } from "@/types/database";
import { supabase } from "@/utils/supabase";

export const DestinationServices = {
  async fetchBatch(
    limit: number,
    offset: number = 0,
  ): Promise<{
    data: Destination[];
    hasMore: boolean;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("destination")
      .select("*")
      .range(offset, offset + limit - 1)
      .order("id");
    if (error) throw error;
    return {
      data: data ?? [],
      hasMore: (data?.length ?? 0) === limit,
      error,
    };
  },
};
