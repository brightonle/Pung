export type Suit = 'dots' | 'bamboo' | 'characters' | 'winds' | 'dragons' | 'flowers' | 'seasons'
export type Seat = 'east' | 'south' | 'west' | 'north'
export type GamePhase = 'waiting' | 'dealing' | 'playing' | 'claiming' | 'finished'
export type ClaimType = 'pong' | 'chow' | 'kong' | 'win' | 'pass'
export type MeldType = 'pong' | 'chow' | 'kong' | 'concealed-kong'

export interface Tile {
  id: string
  suit: Suit
  value: number | string
}

export interface Meld {
  type: MeldType
  tiles: Tile[]
}

export interface Player {
  id: string
  name: string
  seat: Seat
  hand: Tile[]
  melds: Meld[]
  flowerTiles: Tile[]
  tileCount: number
  score: number
  isDealer: boolean
  isConnected: boolean
}

export interface GameState {
  roomCode: string
  phase: GamePhase
  players: Player[]
  currentTurn: Seat
  lastDiscard: Tile | null
  lastDiscardBy: Seat | null
  discardPile: Tile[]
  wallCount: number
  roundWind: Seat
  roundNumber: number
  winner: Seat | null
  winningHand: Tile[] | null
}

// ── Socket payloads C→S ──────────────────────────────────────
export interface JoinRoomPayload {
  roomCode: string
  playerName: string
}

export interface DiscardTilePayload {
  tileId: string
}

export interface ClaimPayload {
  claimType: 'pong' | 'chow' | 'kong' | 'win'
  chowTileIds?: [string, string]
}

export interface KongPayload {
  tileId: string
  kongType: 'declared' | 'concealed'
}

// ── Socket payloads S→C ──────────────────────────────────────
export interface RoomUpdatePayload {
  roomCode: string
  players: Array<{ id: string; name: string; seat: Seat; isConnected: boolean; isBot?: boolean }>
  hostId: string
}

export interface GameStartPayload {
  gameState: GameState
  yourHand: Tile[]
}

export interface TileDrawnPayload {
  tile: Tile
  newWallCount: number
  bonusTiles?: Tile[]
}

export interface TileDiscardedPayload {
  by: Seat
  tile: Tile
  claimWindow: boolean
  newDiscardPile: Tile[]
}

export interface ClaimResultPayload {
  claimedBy: Seat | null
  claimType: ClaimType
  updatedGameState: Partial<GameState>
  newMeld?: Meld
}

export interface GameOverPayload {
  winner: Seat | null
  winningHand: Tile[] | null
  winType: 'self-draw' | 'discard' | 'draw'
  scores: Record<Seat, number>
  playerHands?: Partial<Record<Seat, Tile[]>>
  handName?: string
}

export interface ErrorPayload {
  code: string
  message: string
}
