import { getSocket } from './useSocket'
import { useGameStore } from '../store/gameStore'
import type { ClaimType } from '../types'

export function useGameActions() {
  const store = useGameStore.getState

  function joinRoom(roomCode: string, playerName: string) {
    store().setPlayerName(playerName)
    getSocket().emit('join-room', { roomCode, playerName })
  }

  function createRoom(playerName: string) {
    store().setPlayerName(playerName)
    getSocket().emit('create-room', { playerName })
  }

  function addBot() {
    getSocket().emit('add-bot')
  }

  function startGame() {
    getSocket().emit('game-start')
  }

  function drawTile() {
    getSocket().emit('draw-tile')
  }

  function discardTile(tileId: string) {
    store().removeTileFromHand(tileId)
    getSocket().emit('discard-tile', { tileId })
  }

  function sendClaim(claimType: Exclude<ClaimType, 'pass'>, chowTileIds?: [string, string]) {
    getSocket().emit('claim', { claimType, chowTileIds })
  }

  function passClaim() {
    getSocket().emit('pass')
  }

  function declareWin() {
    getSocket().emit('declare-win')
  }

  return { joinRoom, createRoom, addBot, startGame, drawTile, discardTile, sendClaim, passClaim, declareWin }
}
