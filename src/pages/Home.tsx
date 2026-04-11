import { useEffect, useState } from "react";
import { getMatches, getTeams } from "../api/index.ts";
import { calculateStandings } from "../utils/standings.ts";
import type { Match, Team, Standing } from "../types/index.ts";
import Table from "../components/Table.tsx";

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [round, setRound] = useState<number>(1);
  const [maxRound, setMaxRound] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, fetch all matches and teams
  useEffect(() => {
    const init = async () => {
      try {
        const [allMatchesData, teamsData]: [Match[], Team[]] = await Promise.all([getMatches(), getTeams()]);

        const completedMatches = allMatchesData.filter(m => m.status === "FT");
        const latest = Math.max(...completedMatches.map(m => m.round));

        setAllMatches(allMatchesData);
        setTeams(teamsData);
        setMaxRound(latest);
        setRound(latest);
        setStandings(calculateStandings(allMatchesData, teamsData));
      } catch (err) {
        setError("Failed to load data.");
      }
    };
    init();
  }, []);

  // Fetch matches for selected round
  useEffect(() => {
    if (!round) return;
    const fetchRound = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: Match[] = await getMatches(round);
        setMatches(data);
      } catch (err) {
        setError("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };
    fetchRound();
  }, [round]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className='min-h-screen p-5'>
      <div className='flex gap-2 items-start max-w-[960px] mx-auto mt-10'>
        {/* Results window */}
        <div className='flex-1 bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] border border-[#404040]'>
          <div className='bg-[#000080] text-white font-win95 text-base px-1 py-0.5 flex items-center justify-between select-none'>
            <span>EPL Tracker — Results</span>
            <div className='flex gap-0.5'>
              <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
                _
              </button>
              <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
                □
              </button>
              <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
                ✕
              </button>
            </div>
          </div>
          <div className='p-2'>
            {/* Round selector */}
            <div className='flex items-center gap-2 mb-2'>
              <button
                className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-3 py-0.5 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'
                onClick={() => setRound(r => r - 1)}
                disabled={round <= 1}
              >
                ◄
              </button>
              <div className='flex-1 text-center [box-shadow:var(--shadow-sunken)] bg-white p-1'>Gameweek {round}</div>
              <button
                className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-3 py-0.5 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'
                onClick={() => setRound(r => r + 1)}
                disabled={round >= maxRound}
              >
                ►
              </button>
            </div>

            {/* Match list */}
            <div className='[box-shadow:var(--shadow-sunken)] bg-white p-1'>
              {loading && <div className='p-2'>Loading...</div>}
              {error && <div className='p-2 text-red-600'>{error}</div>}
              {!loading && !error && matches.length === 0 && <div className='p-2'>No matches found.</div>}
              {!loading &&
                !error &&
                matches.map(match => (
                  <div
                    key={match.id}
                    className='grid [grid-template-columns:1fr_auto_1fr] items-center px-2 py-1 border-b border-[#808080] gap-2'
                  >
                    <div className='flex items-center gap-1 justify-end'>
                      <span>{match.home_team_name}</span>
                      <img src={match.home_team_logo} alt={match.home_team_name} className='w-4 h-4' />
                    </div>
                    <div className='text-center min-w-[48px]'>
                      {match.status === "FT"
                        ? `${match.home_goals} - ${match.away_goals}`
                        : formatDate(match.match_date)}
                    </div>
                    <div className='flex items-center gap-1'>
                      <img src={match.away_team_logo} alt={match.away_team_name} className='w-4 h-4' />
                      <span>{match.away_team_name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Table standings={standings} />
      </div>
    </div>
  );
};

export default Home;
