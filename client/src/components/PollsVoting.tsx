import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Users, TrendingUp, Equal } from "lucide-react";
import { Match } from "../types/match";

// Firebase imports - install with: npm install firebase
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Firebase config - replace with your config
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "your-app-id"
// };

const firebaseConfig = {

  apiKey: "AIzaSyD-KX7FdSOLYd_po6cV07OxmVme_l49RbI",

  authDomain: "pollskika.firebaseapp.com",

  projectId: "pollskika",

  storageBucket: "pollskika.firebasestorage.app",

  messagingSenderId: "553483358469",

  appId: "1:553483358469:web:a38c477aa71473b69ea76c"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface PollsVotingProps {
  match: Match;
}

interface PollResults {
  home: number;
  away: number;
  draw: number;
  total: number;
}

interface UserVote {
  hasVoted: boolean;
  teamChoice: 'home' | 'away' | 'draw' | null;
}

interface Vote {
  id: string;
  matchId: string;
  teamChoice: 'home' | 'away' | 'draw';
  userId: string;
  timestamp: Timestamp;
}

const PollsVoting: React.FC<PollsVotingProps> = ({ match }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [results, setResults] = useState<PollResults>({ home: 0, away: 0, draw: 0, total: 0 });
  const [userVote, setUserVote] = useState<UserVote>({ hasVoted: false, teamChoice: null });
  const [isVoting, setIsVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Generate a unique user ID if it doesn't exist
  const getUserId = (): string => {
    let userId = localStorage.getItem('pollUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('pollUserId', userId);
    }
    return userId;
  };

  // Calculate poll results from votes
  const calculateResults = (votes: Vote[]): PollResults => {
    const results = { home: 0, away: 0, draw: 0, total: 0 };

    votes.forEach(vote => {
      if (vote.teamChoice in results) {
        results[vote.teamChoice]++;
        results.total++;
      }
    });

    return results;
  };

  // Load poll data and set up real-time listener
  useEffect(() => {
    const userId = getUserId();

    // Set up real-time listener for all votes for this match
    const votesQuery = query(
      collection(db, 'polls'), 
      where('matchId', '==', match.id)
    );

    const unsubscribe = onSnapshot(votesQuery, (snapshot) => {
      const votes: Vote[] = [];
      let userHasVoted = false;
      let userChoice: 'home' | 'away' | 'draw' | null = null;

      snapshot.forEach((doc) => {
        const voteData = doc.data() as Vote;
        votes.push(voteData);

        // Check if current user has voted
        if (voteData.userId === userId) {
          userHasVoted = true;
          userChoice = voteData.teamChoice;
        }
      });

      // Update results
      const calculatedResults = calculateResults(votes);
      setResults(calculatedResults);

      // Update user vote status
      setUserVote({
        hasVoted: userHasVoted,
        teamChoice: userChoice
      });

      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching votes:", error);
      setError("Failed to load poll data");
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [match.id]);

  const handleVote = async (teamChoice: 'home' | 'away' | 'draw') => {
    if (userVote.hasVoted || isVoting) return;

    setIsVoting(true);
    setError("");

    try {
      const userId = getUserId();
      const voteId = `${match.id}_${userId}`;

      // Check if user has already voted (double-check)
      const existingVoteDoc = await getDoc(doc(db, 'polls', voteId));
      if (existingVoteDoc.exists()) {
        setError("You have already voted for this match");
        setIsVoting(false);
        return;
      }

      // Create new vote document
      const voteData = {
        id: voteId,
        matchId: match.id,
        teamChoice,
        userId,
        timestamp: serverTimestamp()
      };

      // Save vote to Firestore
      await setDoc(doc(db, 'polls', voteId), voteData);

      // The real-time listener will automatically update the UI

    } catch (error) {
      console.error("Error submitting vote:", error);
      setError("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const getPercentage = (votes: number) => {
    if (results.total === 0) return 0;
    return Math.round((votes / results.total) * 100);
  };

  const homePercentage = getPercentage(results.home);
  const awayPercentage = getPercentage(results.away);
  const drawPercentage = getPercentage(results.draw);

  if (isLoading) {
    return (
      <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Match Poll</h2>
              <p className="text-xs text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Loading poll data...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div 
        className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 cursor-pointer flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
        onClick={() => setIsVisible(!isVisible)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Match Poll</h2>
            <p className="text-xs text-gray-600">Cast your prediction</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {results.total > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              <Users className="h-3 w-3" />
              <span>{results.total}</span>
            </div>
          )}
          {isVisible ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {isVisible && (
        <div className="p-4">
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          {!userVote.hasVoted ? (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Who will win? {match.clubs.home.name} vs {match.clubs.away.name}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Home Team Vote Button */}
                <button
                  onClick={() => handleVote('home')}
                  disabled={isVoting}
                  className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <img
                      src={match.clubs.home.logo}
                      alt={match.clubs.home.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      {match.clubs.home.name}
                    </span>
                  </div>
                </button>

                {/* Draw Vote Button */}
                <button
                  onClick={() => handleVote('draw')}
                  disabled={isVoting}
                  className="p-3 rounded-lg border-2 border-yellow-200 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <Equal className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      Draw
                    </span>
                  </div>
                </button>

                {/* Away Team Vote Button */}
                <button
                  onClick={() => handleVote('away')}
                  disabled={isVoting}
                  className="p-3 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <img
                      src={match.clubs.away.logo}
                      alt={match.clubs.away.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      {match.clubs.away.name}
                    </span>
                  </div>
                </button>
              </div>

              {isVoting && (
                <div className="text-center py-2">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-xs">Voting...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                  <span className="text-xs text-green-600 font-medium">✓ Vote Cast</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Home Team Result */}
                <div className={`p-3 rounded-lg border-2 ${
                  userVote.teamChoice === 'home' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <img
                      src={match.clubs.home.logo}
                      alt={match.clubs.home.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      {match.clubs.home.name}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${homePercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{homePercentage}%</span>
                  </div>
                </div>

                {/* Draw Result */}
                <div className={`p-3 rounded-lg border-2 ${
                  userVote.teamChoice === 'draw' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <Equal className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      Draw
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${drawPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{drawPercentage}%</span>
                  </div>
                </div>

                {/* Away Team Result */}
                <div className={`p-3 rounded-lg border-2 ${
                  userVote.teamChoice === 'away' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <img
                      src={match.clubs.away.logo}
                      alt={match.clubs.away.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="font-medium text-gray-800 text-xs text-center leading-tight">
                      {match.clubs.away.name}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${awayPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{awayPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-600 bg-gray-50 rounded-md py-2">
                <p>Total votes: {results.total} • Home: {results.home} • Draw: {results.draw} • Away: {results.away}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PollsVoting;