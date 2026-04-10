import { create } from 'zustand'
import type { GameState, Tile, Seat } from '../types'

interface RoomInfo {
  roomCode: string
  hostId: string
  players: Array<{ id: string; name: string; seat: string; isConnected: boolean; isBot?: boolean }>
}

export interface ClaimAnimation {
  tile: Tile
  bySeat: Seat
}

interface GameStore {
  // Connection
  socketId: string | null
  connected: boolean

  // Lobby
  playerName: string
  roomInfo: RoomInfo | null
  serverError: string | null

  // Game
  gameState: GameState | null
  myHand: Tile[]
  drawnTile: Tile | null
  selectedTileId: string | null
  claimAnimation: ClaimAnimation | null
  winningHandName: string | null

  // Actions
  setSocketId: (id: string | null) => void
  setConnected: (c: boolean) => void
  setPlayerName: (name: string) => void
  setRoomInfo: (info: RoomInfo | null) => void
  setServerError: (msg: string | null) => void
  setGameState: (state: GameState) => void
  setMyHand: (hand: Tile[]) => void
  addTileToHand: (tile: Tile) => void
  setDrawnTile: (tile: Tile | null) => void
  removeTileFromHand: (tileId: string) => void
  selectTile: (id: string | null) => void
  setClaimAnimation: (anim: ClaimAnimation | null) => void
  setWinningHandName: (name: string | null) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  socketId: null,
  connected: false,
  playerName: '',
  roomInfo: null,
  serverError: null,
  gameState: null,
  myHand: [],
  drawnTile: null,
  selectedTileId: null,
  claimAnimation: null,
  winningHandName: null,

  setSocketId: (id) => set({ socketId: id }),
  setConnected: (connected) => set({ connected }),
  setPlayerName: (playerName) => set({ playerName }),
  setRoomInfo: (roomInfo) => set({ roomInfo }),
  setServerError: (serverError) => set({ serverError }),
  setGameState: (gameState) => set({ gameState }),
  setMyHand: (myHand) => set({ myHand }),
  addTileToHand: (tile) => set((s) => ({ myHand: [...s.myHand, tile], drawnTile: tile })),
  setDrawnTile: (drawnTile) => set({ drawnTile }),
  removeTileFromHand: (tileId) =>
    set((s) => ({
      myHand: s.myHand.filter((t) => t.id !== tileId),
      selectedTileId: s.selectedTileId === tileId ? null : s.selectedTileId,
      drawnTile: null, // always clear on any discard — drawn state is over
    })),
  selectTile: (selectedTileId) => set({ selectedTileId }),
  setClaimAnimation: (claimAnimation) => set({ claimAnimation }),
  setWinningHandName: (winningHandName) => set({ winningHandName }),
  reset: () =>
    set({
      gameState: null,
      myHand: [],
      drawnTile: null,
      selectedTileId: null,
      roomInfo: null,
      winningHandName: null,
    }),
}))
