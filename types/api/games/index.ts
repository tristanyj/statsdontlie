export type GameDTO = {
  id: number;
  identifier: string;
  name: string;
  description: string;
  releaseDate: number | null;
  minPlayers: number;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
};
