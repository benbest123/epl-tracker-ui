import type { Match, Team, Standing } from "../types/index.ts";

export const calculateStandings = (matches: Match[], teams: Team[]): Standing[] => {
  const table: Record<number, Standing> = {};

  // Initialise every team with zero stats
  for (const team of teams) {
    table[team.id] = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    };
  }

  // Only process completed matches
  const completed = matches.filter(m => m.status === "FT" && m.home_goals !== null && m.away_goals !== null);

  for (const match of completed) {
    const home = table[match.home_team_id];
    const away = table[match.away_team_id];

    if (!home || !away) continue;

    const hg = match.home_goals!;
    const ag = match.away_goals!;

    home.played++;
    away.played++;
    home.gf += hg;
    home.ga += ag;
    away.gf += ag;
    away.ga += hg;

    if (match.result === "home") {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (match.result === "away") {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    }
  }

  // Calculate goal difference and sort
  return Object.values(table)
    .map(s => ({ ...s, gd: s.gf - s.ga }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
};
