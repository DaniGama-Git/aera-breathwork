/**
 * SearchScreen — Dedicated search page
 * Route: /search
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarPlus, SlidersHorizontal, X } from "lucide-react";
import { categoryConfig } from "@/data/sessionData";
import BottomNavBar from "@/components/BottomNavBar";
import AddToCalendar from "@/components/AddToCalendar";
import playIconSmall from "@/assets/play-icon-small.svg";

interface SearchSession {
  title: string;
  description: string;
  duration: string;
  category: string;
  to: string;
  image: string;
}

// Build a flat list of ALL sessions from every category, then shuffle with a stable seed
function buildAllSessions(): SearchSession[] {
  const sessions: SearchSession[] = [];

  Object.values(categoryConfig).forEach((cat) => {
    cat.sessions.forEach((s) => {
      sessions.push({
        title: s.title,
        description: s.description,
        duration: s.duration,
        category: cat.label,
        to: cat.sessionRoute,
        image: cat.image,
      });
    });
  });

  // Deterministic shuffle (Fisher-Yates with simple seed)
  let seed = 42;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = sessions.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [sessions[i], sessions[j]] = [sessions[j], sessions[i]];
  }

  return sessions;
}

const allSessions = buildAllSessions();

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDuration, setActiveDuration] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const categoryNames = useMemo(() => {
    const unique = new Set(allSessions.map((s) => s.category));
    return Array.from(unique).sort();
  }, []);

  const durationBuckets = ["Short", "Medium", "Long"];

  const matchesDuration = (sessionDuration: string, bucket: string) => {
    const mins = parseInt(sessionDuration);
    if (bucket === "Short") return mins <= 5;
    if (bucket === "Medium") return mins > 5 && mins < 10;
    return mins >= 10;
  };

  const isSearching = query.trim().length > 0;

  const filteredSessions = useMemo(() => {
    let list = allSessions;
    if (activeCategory) {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (activeDuration) {
      list = list.filter((s) => matchesDuration(s.duration, activeDuration));
    }
    if (isSearching) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, isSearching, activeCategory, activeDuration]);

  const activeFilterCount = (activeCategory ? 1 : 0) + (activeDuration ? 1 : 0);

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveDuration(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

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

        {/* Search bar + filter icon */}
        <div className="px-5 md:px-8 mb-5">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full h-11 rounded-2xl bg-white pl-10 pr-4 text-[14px] font-body text-[#1D1D1C] placeholder:text-[#BDBDBD] border-0 outline-none focus:ring-2 focus:ring-[#1D1D1C]/10 transition-shadow"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center border-0 cursor-pointer transition-colors ${
                  filterOpen || activeFilterCount > 0
                    ? "bg-[#1D1D1C] text-white"
                    : "bg-white text-[#BDBDBD] hover:text-[#1D1D1C]"
                }`}
                aria-label="Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1D1D1C] border-2 border-[#F7F6F5] text-white text-[9px] font-body font-semibold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Filter dropdown */}
              {filterOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-lg border border-[#ECECEC] p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body font-semibold text-[14px] text-[#1D1D1C]">Filters</p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="font-body text-[12px] text-[#BDBDBD] bg-transparent border-0 cursor-pointer hover:text-[#1D1D1C] transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <p className="font-body font-medium text-[12px] text-[#BDBDBD] mb-2">Category</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {categoryNames.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                        className={`px-3 py-1 rounded-full font-body text-[12px] border-0 cursor-pointer transition-colors ${
                          activeCategory === cat
                            ? "bg-[#1D1D1C] text-white"
                            : "bg-[#F0EFED] text-[#1D1D1C] hover:bg-[#E5E4E2]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Duration */}
                  <p className="font-body font-medium text-[12px] text-[#BDBDBD] mb-2">Duration</p>
                  <div className="flex flex-wrap gap-1.5">
                    {durationBuckets.map((d) => (
                      <button
                        key={d}
                        onClick={() => setActiveDuration(activeDuration === d ? null : d)}
                        className={`px-3 py-1 rounded-full font-body text-[12px] border-0 cursor-pointer transition-colors ${
                          activeDuration === d
                            ? "bg-[#1D1D1C] text-white"
                            : "bg-[#F0EFED] text-[#1D1D1C] hover:bg-[#E5E4E2]"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1D1D1C] text-white font-body text-[12px] border-0 cursor-pointer"
                >
                  {activeCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeDuration && (
                <button
                  onClick={() => setActiveDuration(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1D1D1C] text-white font-body text-[12px] border-0 cursor-pointer"
                >
                  {activeDuration}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
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
              {filteredSessions.map((session) => {
                const durationNum = parseInt(session.duration) || 5;
                return (
                  <div
                    key={session.title}
                    className="flex items-center gap-4 bg-white rounded-2xl p-3 transition-shadow hover:shadow-md"
                  >
                    <Link
                      to={session.to}
                      onClick={() => handleSessionClick(session.title)}
                      className="flex items-center gap-4 no-underline flex-1 min-w-0"
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
                    <AddToCalendar
                      sessionTitle={session.title}
                      sessionSubtitle={session.description}
                      sessionCategory={session.category}
                      durationMinutes={durationNum}
                      trigger={
                        <button
                          className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#F0EFED] flex items-center justify-center text-[#BDBDBD] hover:text-[#1D1D1C] hover:bg-[#E5E4E2] transition-colors"
                          aria-label={`Add ${session.title} to calendar`}
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </button>
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNavBar activeTab="Search" />
    </div>
  );
};

export default SearchScreen;
