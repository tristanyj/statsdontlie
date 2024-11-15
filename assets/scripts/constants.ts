import type { StatKey, PlayerKey, SortOption } from '~/types';

export const DEFAULT_PLAYER_IDS: PlayerKey[] = [
  'abdulka01',
  'jamesle01',
  'chambwi01',
  'jordami01',
  'stockjo01',
];

export const DEFAULT_STAT_IDS: StatKey[] = [
  // Awards
  'awards.individual.mvp',
  'awards.individual.dpoy',
  'awards.individual.all_nba',
  'awards.individual.all_nba_first',
  'awards.individual.all_defensive',
  'awards.individual.all_defensive_first',
  'awards.individual.all_star',
  'awards.team.nba_championships',
  'awards.team.conference_championships',
  // Regular season
  'regular_season.total.games_played',
  'regular_season.total.points',
  'regular_season.total.total_rebounds',
  'regular_season.total.assists',
  'regular_season.per_game.points',
  'regular_season.per_game.total_rebounds',
  'regular_season.per_game.assists',
  'regular_season.advanced.player_efficiency_rating',
  'regular_season.advanced.win_shares',
  'regular_season.game_high.points',
  'regular_season.game_high.total_rebounds',
  'regular_season.game_high.assists',
  // Post season
  'post_season.total.games_played',
  'post_season.total.points',
  'post_season.total.total_rebounds',
  'post_season.total.assists',
  'post_season.per_game.points',
  'post_season.per_game.total_rebounds',
  'post_season.per_game.assists',
  'post_season.advanced.player_efficiency_rating',
  'post_season.advanced.win_shares',
  'post_season.game_high.points',
  'post_season.game_high.total_rebounds',
  'post_season.game_high.assists',
];

export const POSITION_EQUIVALENT = {
  PG: 'Point Guard',
  SG: 'Shooting Guard',
  SF: 'Small Forward',
  PF: 'Power Forward',
  C: 'Center',
};

export const PLAYER_SORT_OPTIONS: SortOption[] = [
  {
    label: 'Name',
    key: 'name',
  },
  {
    label: 'Win Shares',
    key: 'win-shares',
  },
  {
    label: 'Height',
    key: 'height',
  },
  {
    label: 'Weight',
    key: 'weight',
  },
  {
    label: 'Experience',
    key: 'experience',
  },
  {
    label: 'Draft Year',
    key: 'draft-year',
  },
];

export const HEIGHT_RANGE = [70, 90];
export const WEIGHT_RANGE = [150, 350];
export const YEARS_RANGE = [1960, 2024];
