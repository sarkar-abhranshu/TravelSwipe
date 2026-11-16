import { useState, useEffect } from "react";
import { DestinationServices } from "../services/destinationService";
import { Destination, DestinationCard, Preferences } from "../types/database";
import { scoreDestination } from "../utils/tagScoring";

export const useDestinations = (prefs: Preferences | null) => {
  const [destinations, setDestinations] = useState<DestinationCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const sortBatch = (data: DestinationCard[]): DestinationCard[] => {
    if (!prefs) return data;
    return data
      .map(d => ({
        destination: d,
        score: scoreDestination(
          d, prefs,
          prefs.location?.latitude ?? null,
          prefs.location?.longitude ?? null
        )
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.destination);
  };

  useEffect(() => {
    const loadInitial = async () => {
      if (loading) return;
      try {
        setLoading(true);
        setOffset(0);
        const { data, hasMore, error } = await DestinationServices.fetchBatch(
          3,
          0
        );
        const sorted = sortBatch(data);
        if (sorted) {
          setDestinations(sorted);
          setHasMore(hasMore);
        }
        if (error) setError(error?.message ?? null);
      } catch (err) {
        console.log('Full error:', err);  // ← add this
        console.log('Error message:', err instanceof Error ? err.message : String(err));
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [prefs]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const newOffset = offset + 10;
    try {
      setLoadingMore(true);
      const { data, hasMore, error } = await DestinationServices.fetchBatch(
        5,
        newOffset
      );
      const sorted = sortBatch(data);
      if (sorted) {
        setDestinations(prev => [...prev, ...sorted]);
        setHasMore(hasMore);
        setOffset(newOffset);
      }
      if (error) setError(error?.message ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingMore(false);
    }
  };

  return { destinations, loading, loadingMore, hasMore, error, loadMore };
};
