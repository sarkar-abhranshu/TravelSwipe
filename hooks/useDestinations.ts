import { useState, useEffect } from "react";
import { DestinationServices } from "../services/destinationService";
import { Destination } from "../types/database";

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const loadInitial = async () => {
      if (loading) return;
      try {
        setLoading(true);
        const { data, hasMore, error } = await DestinationServices.fetchBatch(
          10,
          offset
        );
        if (data) {
          setDestinations(data);
          setHasMore(hasMore);
        }
        if (error) setError(error?.message ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const newOffset = offset + 10;
    try {
      setLoadingMore(true);
      const { data, hasMore, error } = await DestinationServices.fetchBatch(
        10,
        newOffset
      );
      if (data) {
        setDestinations([...destinations, ...data]);
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
