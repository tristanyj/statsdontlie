enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

enum PlayerType {
  USER = 'USER',
  BOT = 'BOT',
}

type SessionState = {
  [key: string]: unknown;
};

export type SessionPlayerDTO = {
  id: number;
  sessionId: number;
  username: string;
  playerId: number;
  type: PlayerType;
  turnOrder: number;
  color?: string;
  score?: number;
  result?: string;
};

export type Piece = {
  id: number;
  sessionId: number;
  sessionPlayerId: number;
  row: number;
  col: number;
  isKing: boolean;
  isCaptured: boolean;
  color: 'white' | 'black';
};

export type SessionDTO = {
  id: number;
  gameId: number;
  gameIdentifier: string;
  status: SessionStatus;
  currentPlayerId: number;
  playerCount: number;
  createdAt: string;
  state: SessionState;
  updatedAt: string;
  sessionPlayers: SessionPlayerDTO[];
  pieces?: Piece[];
};
