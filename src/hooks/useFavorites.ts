import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Favorite {
  id: string;
  session_slug: string;
  category: string;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); setLoading(false); return; }
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setFavorites((data as Favorite[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const isFavorite = useCallback(
    (slug: string) => favorites.some((f) => f.session_slug === slug),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (slug: string, category: string) => {
      if (!user) return;
      const existing = favorites.find((f) => f.session_slug === slug);
      if (existing) {
        await supabase.from("favorites").delete().eq("id", existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const { data } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, session_slug: slug, category })
          .select()
          .single();
        if (data) setFavorites((prev) => [data as Favorite, ...prev]);
      }
    },
    [user, favorites]
  );

  return { favorites, loading, isFavorite, toggleFavorite };
}
