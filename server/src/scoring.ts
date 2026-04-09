import type { Tile, Meld, Seat } from './types'

/** Basic HK scoring — returns the base fan count. */
export function calculateScore(
  _winnerSeat: Seat,
  _winningHand: Tile[],
  _melds: Meld[],
  _winType: 'self-draw' | 'discard'
): number {
  // Minimum 1 fan for a valid win
  // Full fan calculation (dragon pungs, wind pungs, all-pong, etc.) can be added later
  return 1
}
