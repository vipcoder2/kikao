import React from "react";
import { Link } from "wouter";
import { Match } from "../types/match";
import { formatMatchDate, isMatchLive, isMatchFinished } from "../utils/dateUtils";
import { Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface MatchCardProps {
  match: Match;
  variant?: "default" | "thin";
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  variant = "default"
}) => {
  const { t } = useLanguage();
  const isLive = isMatchLive(match.kickoff.date, match.kickoff.time, match.score.status);
  const isFinished = isMatchFinished(match.score.status);
  const isUpcoming = !isLive && !isFinished;

  const getStatusColor = () => {
    switch (match.score.status) {
      case 'LIVE':
        return 'bg-red-500 text-white animate-pulse';
      case 'FT':
        return 'bg-gray-100 text-gray-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Link to={`/watch/${match.id}`} className="block">
      <div className="bg-white rounded-lg border hover:shadow-sm transition-all duration-200 py-4 px-4 relative cursor-pointer">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Date and Competition */}
          <div className="text-xs text-gray-600 min-w-[90px] flex-shrink-0">
            <div className="font-medium">{match.kickoff.date}</div>
            <div className="text-gray-500 mt-0.5">{match.competition.name}</div>
          </div>

          {/* Center: Teams */}
          <div className="flex items-center justify-center gap-4 flex-1 min-w-0">
            {/* Home Team */}
            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
              <span className="font-medium text-gray-900 text-sm truncate text-right hidden sm:block">
                {match.clubs.home.name}
              </span>
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {match.clubs.home.logo ? (
                  <img
                    src={match.clubs.home.logo}
                    alt={match.clubs.home.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full" />
                )}
              </div>
            </div>

            {/* Score or VS */}
            <div className="flex items-center justify-center min-w-[60px] text-center">
              {isFinished && match.score.home !== undefined && match.score.away !== undefined ? (
                <div className="text-lg font-bold text-gray-900">
                  {match.score.home} - {match.score.away}
                </div>
              ) : (
                <div className="text-gray-500 font-bold text-lg">vs</div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {match.clubs.away.logo ? (
                  <img
                    src={match.clubs.away.logo}
                    alt={match.clubs.away.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className="font-medium text-gray-900 text-sm truncate text-left hidden sm:block">
                {match.clubs.away.name}
              </span>
            </div>
          </div>

          {/* Right: Status and Watch Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Status Badge - Show for live and upcoming matches */}
            {isLive && (
              <div className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor()}`}>
                <div className="w-2 h-2 bg-white rounded-full" />
                LIVE
              </div>
            )}
            {isUpcoming && (
              <div className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor()}`}>
                <Clock className="w-3 h-3" />
                {match.kickoff.time}
              </div>
            )}

            {/* Watch Button - Hidden on Mobile */}
            <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
              <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 text-sm rounded-md transition-colors">
                {isLive ? t('watch') : t('watch')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;