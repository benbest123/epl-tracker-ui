export interface Team {
  id: number;
  name: string;
  code: string;
  logo_url: string;
}

export interface Match {
  id: number;
  season: number;
  round: number;
  match_date: string;
  status: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_team_logo: string;
  away_team_logo: string;
  home_goals: number | null;
  away_goals: number | null;
  result: string | null;
}
