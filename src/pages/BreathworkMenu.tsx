/**
 * BreathworkMenu — Main browsing/home screen
 * Route: /menu
 * Shows greeting, category cards, favorites, and recommendations.
 */

import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import categoryActivate from "@/assets/category-activate.webp";
import categoryReset from "@/assets/category-reset.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryRecover from "@/assets/category-recover.webp";
import BottomNavBar from "@/components/BottomNavBar";
import homeIndicator from "@/assets/home-indicator.png";
import playIconSmall from "@/assets/play-icon-small.svg";
import playIconLarge from "@/assets/play-icon-large.svg";

const allSessions = [
  { title: "Activate", description: "Counter the afternoon energy dip.", duration: "5 mins", category: "Activate", to: "/breathwork-session-activate", image: categoryActivate },
  { title: "Performance Reset", description: "Clear your head between tasks.", duration: "5 mins", category: "Reset", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Focus Activation", description: "Calm down before you walk in.", duration: "5 mins", category: "Focus", to: "/breathwork-session-focus", image: categoryFocus },
  { title: "Deep Decompression", description: "Wind down after an intense day.", duration: "10 mins", category: "Recover", to: "/breathwork-session-recover", image: categoryRecover },
  { title: "Context Switching", description: "Clear your head between tasks.", duration: "5 mins", category: "Reset", to: "/breathwork-session-reset", image: categoryReset },
];

const categories = [
  { label: "Activate", image: categoryActivate, to: "/breathwork-session-activate" },
  { label: "Reset", image: categoryReset, to: "/breathwork-session-reset" },
  { label: "Focus", image: categoryFocus, to: "/breathwork-session-focus" },
  { label: "Recover", image: categoryRecover, to: "/breathwork-session-recover" },
];

const favorites = [
  { title: "Performance Reset", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Focus Activation", duration: "5 mins", to: "/breathwork-session-focus", image: categoryFocus },
];

const recommendations = [
  { title: "Deep Decompression", duration: "10 mins", to: "/breathwork-session-recover", image: categoryActivate },
  { title: "Context Switching", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const BreathworkMenu = () => {
  const { signOut, user } = useAuth();
  const [query, setQuery] = useState("");

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.name?.split(" ")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const isSearching = query.trim().length > 0;

  const filteredSessions = useMemo(() => {
    if (!isSearching) return [];
    const q = query.toLowerCase();
    return allSessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query, isSearching]);

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col bg-[#F7F6F5]">
      <div className="flex-1 overflow-y-auto pb-28 max-w-[960px] mx-auto w-full">
        {/* Header */}
        <div className="px-5 md:px-8 pt-10 pb-4 flex items-start justify-between">
          <div>
            <p className="font-body font-normal text-[16px] text-[#BDBDBD]">{getGreeting()}</p>
            <h1 className="font-body font-semibold text-[32px] leading-[100%] text-[#1D1D1C] mt-1">{displayName}</h1>
          </div>
          <button
            onClick={signOut}
            className="w-12 h-12 rounded-full overflow-hidden mt-1 flex-shrink-0 border-0 cursor-pointer p-0"
            title="Sign out"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-[#BDBDBD] flex items-center justify-center text-white font-body font-semibold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 md:px-8 mb-4">
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

        {isSearching ? (
          /* Search results */
          <div className="px-5 md:px-8">
            <p className="font-body text-[13px] text-[#BDBDBD] mb-3">
              {filteredSessions.length} result{filteredSessions.length !== 1 ? "s" : ""}
            </p>
            {filteredSessions.length === 0 ? (
              <p className="font-body text-[15px] text-[#BDBDBD] text-center py-12">No sessions found</p>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredSessions.map((session) => (
                  <Link
                    key={session.title}
                    to={session.to}
                    className="flex items-center gap-4 no-underline bg-white rounded-2xl p-3 transition-shadow hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img
                        src={session.image}
                        alt={session.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
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
        ) : (
          <>
            {/* Categories */}
            <div className="px-5 md:px-8 mt-2">
              <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    className="relative overflow-hidden no-underline group"
                    style={{ height: 136, borderRadius: 18.11 }}
                  >
                    <img src={cat.image} alt={cat.label} decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute inset-0 flex items-center justify-center font-body font-medium text-[18px] text-white">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="px-5 md:px-8 mt-8">
              <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Favorites</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {favorites.map((fav) => (
                  <Link key={fav.title} to={fav.to} className="flex items-center gap-3 no-underline">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={fav.image} alt={fav.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(6px)", transform: "scale(1.15)" }} />
                      <div className="absolute inset-0 bg-[#111111]/[0.01]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img src={playIconSmall} alt="Play" width="16" height="17" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-body font-medium text-[14px] text-[#1D1D1C] leading-tight truncate">{fav.title}</p>
                      <p className="font-body font-normal text-[12px] text-[#BDBDBD] mt-0.5">{fav.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="px-5 md:px-8 mt-8">
              <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Recommendations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recommendations.map((rec) => (
                  <Link key={rec.title} to={rec.to} className="relative overflow-hidden no-underline group" style={{ height: 102, borderRadius: 12 }}>
                    <img src={rec.image} alt={rec.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#111111]/[0.01] backdrop-blur-[29px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center justify-center">
                      <img src={playIconLarge} alt="Play" width="21" height="21" />
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="font-body font-semibold text-[14px] text-white leading-tight">{rec.title}</p>
                      <p className="font-body font-normal text-[12px] text-white/70 mt-0.5">{rec.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-[600px] z-20">
        <BottomNavBar activeTab="Search" />
        <div className="flex justify-center pb-2 pt-1 bg-[#F7F6F5]">
          <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-40" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default BreathworkMenu;
