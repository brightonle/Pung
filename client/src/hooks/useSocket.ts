import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'
import type {
  RoomUpdatePayload,
  GameStartPayload,
  TileDrawnPayload,
  TileDiscardedPayload,
  ClaimResultPayload,
  GameOverPayload,
  ErrorPayload,
} from '../types'

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001'

// Singleton socket — persists across StrictMode remounts
let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SERVER_URL, { autoConnect: false })
  }
  return socket
}

export function useSocket() {
  useEffect(() => {
    const sock = getSocket()

    // Named handlers so we can remove exactly these on cleanup
    function onConnect() {
      useGameStore.getState().setSocketId(sock.id ?? null)
      useGameStore.getState().setConnected(true)
    }

    function onDisconnect() {
      useGameStore.getState().setConnected(false)
      useGameStore.getState().setSocketId(null)
    }

    function onRoomUpdate(payload: RoomUpdatePayload) {
      useGameStore.getState().setRoomInfo({
        roomCode: payload.roomCode,
        hostId: payload.hostId,
        players: payload.players,
      })
    }

    function onGameStart(payload: GameStartPayload) {
      useGameStore.getState().setGameState(payload.gameState)
      useGameStore.getState().setMyHand(payload.yourHand)
      useGameStore.getState().setDrawnTile(null)
    }

    function onTileDrawn(payload: TileDrawnPayload) {
      useGameStore.getState().addTileToHand(payload.tile)
      const current = useGameStore.getState().gameState
      if (current) {
        useGameStore.getState().setGameState({ ...current, wallCount: payload.newWallCount })
      }
    }

    function onTileDiscarded(payload: TileDiscardedPayload) {
      const current = useGameStore.getState().gameState
      if (!current) return
      useGameStore.getState().setGameState({
        ...current,
        lastDiscard: payload.tile,
        lastDiscardBy: payload.by,
        discardPile: payload.newDiscardPile,
        phase: payload.claimWindow ? 'claiming' : 'playing',
      })
    }

    function onClaimResult(payload: ClaimResultPayload) {
      const current = useGameStore.getState().gameState
      if (!current) return
      const updatedPlayers = payload.updatedGameState.players ?? current.players
      useGameStore.getState().setGameState({ ...current, ...payload.updatedGameState, players: updatedPlayers })

      if (payload.claimedBy) {
        const myPlayer = updatedPlayers.find(
          (p) => p.id === useGameStore.getState().socketId
        )
        if (myPlayer) {
          useGameStore.getState().setMyHand(myPlayer.hand)
        }
      }
    }

    function onGameOver(payload: GameOverPayload) {
      const current = useGameStore.getState().gameState
      if (!current) return
      useGameStore.getState().setGameState({
        ...current,
        phase: 'finished',
        winner: payload.winner,
        winningHand: payload.winningHand,
        players: current.players.map((p) => ({
          ...p,
          score: payload.scores[p.seat] ?? p.score,
        })),
      })
    }

    function onError(payload: ErrorPayload) {
      console.warn('[socket error]', payload.code, payload.message)
      useGameStore.getState().setServerError(payload.message)
    }

    sock.on('connect', onConnect)
    sock.on('disconnect', onDisconnect)
    sock.on('room-update', onRoomUpdate)
    sock.on('game-start', onGameStart)
    sock.on('tile-drawn', onTileDrawn)
    sock.on('tile-discarded', onTileDiscarded)
    sock.on('claim-result', onClaimResult)
    sock.on('game-over', onGameOver)
    sock.on('error', onError)

    // Connect only if not already connected (safe to call multiple times)
    if (!sock.connected) {
      sock.connect()
    } else {
      // Already connected from a previous mount — sync state immediately
      useGameStore.getState().setSocketId(sock.id ?? null)
      useGameStore.getState().setConnected(true)
    }

    return () => {
      sock.off('connect', onConnect)
      sock.off('disconnect', onDisconnect)
      sock.off('room-update', onRoomUpdate)
      sock.off('game-start', onGameStart)
      sock.off('tile-drawn', onTileDrawn)
      sock.off('tile-discarded', onTileDiscarded)
      sock.off('claim-result', onClaimResult)
      sock.off('game-over', onGameOver)
      sock.off('error', onError)
    }
  }, [])
}
