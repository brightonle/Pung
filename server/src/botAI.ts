import type { Tile, Meld } from './types'
import { canWin, canPong } from './winDetection'

function connectionScore(tile: Tile, others: Tile[]): number {
  let score = 0
  // Pair
  if (others.some((t) => t.suit === tile.suit && t.value === tile.value)) score += 2
  // Sequence potential (numeric suits)
  if (['dots', 'bamboo', 'characters'].includes(tile.suit)) {
    const v = Number(tile.value)
    const sv = others.filter((t) => t.suit === tile.suit).map((t) => Number(t.value))
    if (sv.includes(v - 1)) score += 1
    if (sv.includes(v + 1)) score += 1
    if (sv.includes(v - 2)) score += 0.5
    if (sv.includes(v + 2)) score += 0.5
  }
  return score
}

/** Pick the tile to discard — lowest connection score, prefer honor tiles */
export function botChooseDiscard(hand: Tile[]): Tile {
  let best = hand[0]
  let lowestScore = Infinity

  for (const tile of hand) {
    const others = hand.filter((t) => t.id !== tile.id)
    let score = connectionScore(tile, others)
    // Slightly penalise isolated honor / bonus tiles so they get discarded early
    if (['winds', 'dragons', 'flowers', 'seasons'].includes(tile.suit)) score -= 0.1
    if (score < lowestScore) {
      lowestScore = score
      best = tile
    }
  }

  return best
}

/** Bot decides on a claim: win > pong > pass */
export function botDecideClaim(
  hand: Tile[],
  melds: Meld[],
  discard: Tile
): 'win' | 'pong' | 'pass' {
  if (canWin(hand, melds, discard)) return 'win'
  if (canPong(hand, discard)) return 'pong'
  return 'pass'
}
