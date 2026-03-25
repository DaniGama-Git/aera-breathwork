/**
 * SessionList — Reusable list of placeholder sessions for a category
 */

import { Link } from "react-router-dom";
import playIconSmall from "@/assets/play-icon-small.svg";
import type { SessionItem } from "@/data/sessionData";

interface SessionListProps {
  sessions: SessionItem[];
  categoryImage: string;
  sessionRoute: string;
  currentTitle?: string;
}

const SessionList = ({ sessions, categoryImage, sessionRoute, currentTitle }: SessionListProps) => {
  const otherSessions = currentTitle
    ? sessions.filter((s) => s.title !== currentTitle)
    : sessions;

  if (otherSessions.length === 0) return null;

  return (
    <div className="px-6 pb-6">
      <h3 className="font-body font-semibold text-[16px] text-white/80 mb-3">More sessions</h3>
      <div className="flex flex-col gap-2">
        {otherSessions.map((session) => (
          <Link
            key={session.title}
            to={sessionRoute}
            className="flex items-center gap-3 no-underline bg-white/[0.06] rounded-xl p-3 transition-colors hover:bg-white/[0.1]"
          >
            <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img
                src={categoryImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(4px)", transform: "scale(1.15)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={playIconSmall} alt="Play" width="14" height="15" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body font-medium text-[14px] text-white leading-tight truncate">{session.title}</p>
              <p className="font-body font-normal text-[11px] text-white/40 mt-0.5">{session.duration}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SessionList;
