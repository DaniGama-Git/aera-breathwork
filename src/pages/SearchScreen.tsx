/**
 * SearchScreen — Dedicated search page
 * Route: /search
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import categoryActivate from "@/assets/category-activate.webp";
import categoryReset from "@/assets/category-reset.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryRecover from "@/assets/category-recover.webp";
import BottomNavBar from "@/components/BottomNavBar";
import playIconSmall from "@/assets/play-icon-small.svg";

const allSessions = [
  { title: "Activate", description: "Counter the afternoon energy dip.", duration: "5 mins", category: "Activate", to: "/breathwork-session-activate", image: categoryActivate },
  { title: "Performance Reset", description: "Clear your head between tasks.", duration: "5 mins", category: "Reset", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Focus Activation", description: "Calm down before you walk in.", duration: "5 mins", category: "Focus", to: "/breathwork-session-focus", image: categoryFocus },
  { title: "Deep Decompression", description: "Wind down after an intense day.", duration: "10 mins", category: "Recover", to: "/breathwork-session-recover", image: categoryRecover },
];

const RECENT_KEY = "aera_recent_searches";

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const recent = getRecentSearches().filter((t) => t !== term);
  recent.unshift(term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)));
}

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const isSearching = query.trim().length > 0;

  const filteredSessions = useMemo(() => {
    if (!isSearching) return allSessions;
    const q = query.toLowerCase();
    return allSessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query, isSearching]);

  const handleSessionClick = (title: string) => {
    if (isSearching) {
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col bg-[#F7F6F5]">
      <div className="flex-1 overflow-y-auto pb-28 max-w-[960px] mx-auto w-full">
        {/* Header */}
        <div className="px-5 md:px-8 pt-10 pb-2">
          <h1 className="font-body font-semibold text-[28px] text-[#1D1D1C]">Search</h1>
        </div>

        {/* Search bar */}
        <div className="px-5 md:px-8 mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full h-11 rounded-2xl bg-white pl-10 pr-4 text-[14px] font-body text-[#1D1D1C] placeholder:text-[#BDBDBD] border-0 outline-none focus:ring-2 focus:ring-[#1D1D1C]/10 transition-shadow"
            />
          </div>
        </div>

        {/* Recent searches */}
        {!isSearching && recentSearches.length > 0 && (
          <div className="px-5 md:px-8 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body font-medium text-[14px] text-[#1D1D1C]">Recent</p>
              <button onClick={clearRecent} className="font-body text-[12px] text-[#BDBDBD] bg-transparent border-0 cursor-pointer">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="px-3 py-1.5 rounded-full bg-white font-body text-[13px] text-[#1D1D1C] border-0 cursor-pointer hover:bg-[#EEEEEE] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="px-5 md:px-8">
          {isSearching && (
            <p className="font-body text-[13px] text-[#BDBDBD] mb-3">
              {filteredSessions.length} result{filteredSessions.length !== 1 ? "s" : ""}
            </p>
          )}
          {!isSearching && (
            <p className="font-body font-medium text-[14px] text-[#1D1D1C] mb-3">All Sessions</p>
          )}

          {filteredSessions.length === 0 ? (
            <p className="font-body text-[15px] text-[#BDBDBD] text-center py-12">No sessions found</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSessions.map((session) => (
                <Link
                  key={session.title}
                  to={session.to}
                  onClick={() => handleSessionClick(session.title)}
                  className="flex items-center gap-4 no-underline bg-white rounded-2xl p-3 transition-shadow hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={session.image} alt={session.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={playIconSmall} alt="Play" width="16" height="17" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body font-medium text-[15px] text-[#1D1D1C] leading-tight truncate">{session.title}</p>
                    <p className="font-body font-normal text-[12px] text-[#BDBDBD] mt-0.5">{session.description}</p>
                    <p className="font-body font-normal text-[11px] text-[#BDBDBD] mt-1">{session.duration} · {session.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavBar activeTab="Search" />
    </div>
  );
};

export default SearchScreen;
