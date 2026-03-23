import { useEffect, useState } from "react";
import { getMatches } from "../api/index.ts";
import type { Match } from "../types/index.ts";

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number>(1);
  const [maxRound, setMaxRound] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, fetch all matches to determine the latest round
  useEffect(() => {
    const init = async () => {
      try {
        const allMatches: Match[] = await getMatches();
        const completedMatches = allMatches.filter(m => m.status === "FT");
        const latest = Math.max(...completedMatches.map(m => m.round));
        setMaxRound(latest);
        setRound(latest);
      } catch (err) {
        setError("Failed to load matches.");
      }
    };
    init();
  }, []);

  // Fetch matches whenever round changes
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
    <div className='desktop'>
      <div className='window' style={{ width: "520px", margin: "40px auto" }}>
        {/* Title bar */}
        <div className='window-title-bar'>
          <span>⚽ EPL Tracker</span>
          <div style={{ display: "flex", gap: "2px" }}>
            <button className='btn' style={{ padding: "0 6px" }}>
              _
            </button>
            <button className='btn' style={{ padding: "0 6px" }}>
              □
            </button>
            <button className='btn' style={{ padding: "0 6px" }}>
              ✕
            </button>
          </div>
        </div>

        {/* Window content */}
        <div className='window-content'>
          {/* Results window */}
          <div className='window' style={{ marginBottom: "8px" }}>
            <div className='window-title-bar'>
              <span>Results</span>
            </div>
            <div className='window-content'>
              {/* Round selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <button className='btn' onClick={() => setRound(r => r - 1)} disabled={round <= 1}>
                  ◄
                </button>
                <div className='inset' style={{ flex: 1, textAlign: "center" }}>
                  Gameweek {round}
                </div>
                <button className='btn' onClick={() => setRound(r => r + 1)} disabled={round >= maxRound}>
                  ►
                </button>
              </div>

              {/* Match list */}
              <div className='inset'>
                {loading && <div style={{ padding: "8px" }}>Loading...</div>}
                {error && <div style={{ padding: "8px", color: "red" }}>{error}</div>}
                {!loading && !error && matches.length === 0 && <div style={{ padding: "8px" }}>No matches found.</div>}
                {!loading &&
                  !error &&
                  matches.map(match => (
                    <div
                      key={match.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        padding: "4px 8px",
                        borderBottom: "1px solid var(--surface-dark)",
                        gap: "8px",
                      }}
                    >
                      {/* Home team */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                        <span>{match.home_team_name}</span>
                        <img
                          src={match.home_team_logo}
                          alt={match.home_team_name}
                          style={{ width: "16px", height: "16px" }}
                        />
                      </div>

                      {/* Score */}
                      <div style={{ textAlign: "center", minWidth: "48px" }}>
                        {match.status === "FT"
                          ? `${match.home_goals} - ${match.away_goals}`
                          : formatDate(match.match_date)}
                      </div>

                      {/* Away team */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <img
                          src={match.away_team_logo}
                          alt={match.away_team_name}
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span>{match.away_team_name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
