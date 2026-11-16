import { DestinationCard, DestinationDetail } from "@/types/database";
import { supabase } from "@/utils/supabase";

const detailCache = new Map<string, DestinationDetail>();

export const DestinationServices = {
  async fetchBatch(
    limit: number,
    offset: number = 0,
  ): Promise<{
    data: DestinationCard[];
    hasMore: boolean;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("destinations")
      .select("id, name, image_url, short_description, tags, latitude, longitude, trip_duration_min, trip_duration_max")
      .range(offset, offset + limit - 1)
      .order("id");
    if (error) throw error;
    return {
      data: data ?? [],
      hasMore: (data?.length ?? 0) === limit,
      error,
    };
  },

  async fetchDetail(id: string): Promise<DestinationDetail> {
    if (detailCache.has(id)) return detailCache.get(id)!;

    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    detailCache.set(id, data);
    return data;
  }
};
