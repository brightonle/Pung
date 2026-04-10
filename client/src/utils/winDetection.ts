/**
 * Client-side win detection — mirrors server logic, used for UI hints only.
 * The server is authoritative for actual win validation.
 */
import type { Tile, Meld } from '../types'
import { isNumericSuit, tilesEqual } from './tileUtils'

function sortForBacktrack(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit.localeCompare(b.suit)
    return String(a.value).localeCompare(String(b.value), undefined, { numeric: true })
  })
}

// ── Set-forming helpers ──────────────────────────────────────────────────────

function canFormSets(tiles: Tile[], setsRemaining: number): boolean {
  if (setsRemaining === 0) return tiles.length === 0
  if (tiles.length === 0) return false
  const sorted = sortForBacktrack(tiles)
  const first = sorted[0]
  const rest = sorted.slice(1)
  // Try pong
  const m1 = rest.findIndex((t) => tilesEqual(t, first))
  if (m1 !== -1) {
    const a1 = [...rest.slice(0, m1), ...rest.slice(m1 + 1)]
    const m2 = a1.findIndex((t) => tilesEqual(t, first))
    if (m2 !== -1) {
      const a2 = [...a1.slice(0, m2), ...a1.slice(m2 + 1)]
      if (canFormSets(a2, setsRemaining - 1)) return true
    }
  }
  // Try chow
  if (isNumericSuit(first.suit)) {
    const v = Number(first.value)
    const i1 = rest.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 1)
    if (i1 !== -1) {
      const a1 = [...rest.slice(0, i1), ...rest.slice(i1 + 1)]
      const i2 = a1.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 2)
      if (i2 !== -1) {
        const a2 = [...a1.slice(0, i2), ...a1.slice(i2 + 1)]
        if (canFormSets(a2, setsRemaining - 1)) return true
      }
    }
  }
  return false
}

function canFormPongsOnly(tiles: Tile[], setsRemaining: number): boolean {
  if (setsRemaining === 0) return tiles.length === 0
  if (tiles.length < 3) return false
  const sorted = sortForBacktrack(tiles)
  const first = sorted[0]
  const rest = sorted.slice(1)
  const m1 = rest.findIndex((t) => tilesEqual(t, first))
  if (m1 === -1) return false
  const a1 = [...rest.slice(0, m1), ...rest.slice(m1 + 1)]
  const m2 = a1.findIndex((t) => tilesEqual(t, first))
  if (m2 === -1) return false
  const a2 = [...a1.slice(0, m2), ...a1.slice(m2 + 1)]
  return canFormPongsOnly(a2, setsRemaining - 1)
}

function canFormChowsOnly(tiles: Tile[], setsRemaining: number): boolean {
  if (setsRemaining === 0) return tiles.length === 0
  if (tiles.length < 3) return false
  const sorted = sortForBacktrack(tiles)
  const first = sorted[0]
  if (!isNumericSuit(first.suit)) return false
  const v = Number(first.value)
  const rest = sorted.slice(1)
  const i1 = rest.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 1)
  if (i1 === -1) return false
  const a1 = [...rest.slice(0, i1), ...rest.slice(i1 + 1)]
  const i2 = a1.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 2)
  if (i2 === -1) return false
  const a2 = [...a1.slice(0, i2), ...a1.slice(i2 + 1)]
  return canFormChowsOnly(a2, setsRemaining - 1)
}

function isStandardWin(tiles: Tile[], setsNeeded: number): boolean {
  const sorted = sortForBacktrack(tiles)
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && tilesEqual(sorted[i], sorted[i - 1])) continue
    const rest = [...sorted.slice(0, i), ...sorted.slice(i + 1)]
    const pi = rest.findIndex((t) => tilesEqual(t, sorted[i]))
    if (pi === -1) continue
    const remaining = [...rest.slice(0, pi), ...rest.slice(pi + 1)]
    if (canFormSets(remaining, setsNeeded)) return true
  }
  return false
}

// ── Special hand helpers ─────────────────────────────────────────────────────

function isThirteenOrphans(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false
  const orphans: Pick<Tile, 'suit' | 'value'>[] = [
    { suit: 'dots', value: 1 }, { suit: 'dots', value: 9 },
    { suit: 'bamboo', value: 1 }, { suit: 'bamboo', value: 9 },
    { suit: 'characters', value: 1 }, { suit: 'characters', value: 9 },
    { suit: 'winds', value: 'east' }, { suit: 'winds', value: 'south' },
    { suit: 'winds', value: 'west' }, { suit: 'winds', value: 'north' },
    { suit: 'dragons', value: 'red' }, { suit: 'dragons', value: 'green' },
    { suit: 'dragons', value: 'white' },
  ]
  const remaining = [...tiles]
  for (const o of orphans) {
    const idx = remaining.findIndex((t) => t.suit === o.suit && t.value === o.value)
    if (idx === -1) return false
    remaining.splice(idx, 1)
  }
  return remaining.length === 1 && orphans.some((o) => remaining[0].suit === o.suit && remaining[0].value === o.value)
}

function isSevenPairs(tiles: Tile[], melds: Meld[]): boolean {
  if (melds.length > 0) return false
  if (tiles.length !== 14) return false
  const sorted = sortForBacktrack(tiles)
  for (let i = 0; i < sorted.length; i += 2) {
    if (!tilesEqual(sorted[i], sorted[i + 1])) return false
  }
  return true
}

function countSuit(suit: string, value: string, allTiles: Tile[]): number {
  return allTiles.filter((t) => t.suit === suit && String(t.value) === value).length
}

function isBigFourWinds(allTiles: Tile[], melds: Meld[]): boolean {
  const pool = [...allTiles, ...melds.flatMap((m) => m.tiles)]
  return ['east', 'south', 'west', 'north'].every((w) => countSuit('winds', w, pool) >= 3)
}

function isSmallFourWinds(allTiles: Tile[], melds: Meld[]): boolean {
  const pool = [...allTiles, ...melds.flatMap((m) => m.tiles)]
  const pongs = ['east', 'south', 'west', 'north'].filter((w) => countSuit('winds', w, pool) >= 3)
  const pairs = ['east', 'south', 'west', 'north'].filter((w) => countSuit('winds', w, pool) === 2)
  return pongs.length === 3 && pairs.length === 1
}

function isBigThreeDragons(allTiles: Tile[], melds: Meld[]): boolean {
  const pool = [...allTiles, ...melds.flatMap((m) => m.tiles)]
  return ['red', 'green', 'white'].every((d) => countSuit('dragons', d, pool) >= 3)
}

function isSmallThreeDragons(allTiles: Tile[], melds: Meld[]): boolean {
  const pool = [...allTiles, ...melds.flatMap((m) => m.tiles)]
  const pongs = ['red', 'green', 'white'].filter((d) => countSuit('dragons', d, pool) >= 3)
  const pairs = ['red', 'green', 'white'].filter((d) => countSuit('dragons', d, pool) === 2)
  return pongs.length === 2 && pairs.length === 1
}

function isPureTerminals(allGameTiles: Tile[]): boolean {
  return allGameTiles.every(
    (t) => isNumericSuit(t.suit) && (Number(t.value) === 1 || Number(t.value) === 9)
  )
}

function isPureOneSuit(allGameTiles: Tile[]): boolean {
  if (allGameTiles.length === 0) return false
  const s = allGameTiles[0].suit
  return isNumericSuit(s) && allGameTiles.every((t) => t.suit === s)
}

function isHalfOneSuit(allGameTiles: Tile[]): boolean {
  const numericSuitsUsed = new Set(allGameTiles.filter((t) => isNumericSuit(t.suit)).map((t) => t.suit))
  const hasHonors = allGameTiles.some((t) => t.suit === 'winds' || t.suit === 'dragons')
  return numericSuitsUsed.size === 1 && hasHonors
}

function isAllTriplets(allTiles: Tile[], melds: Meld[], setsNeeded: number): boolean {
  if (melds.some((m) => m.type === 'chow')) return false
  const sorted = sortForBacktrack(allTiles)
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && tilesEqual(sorted[i], sorted[i - 1])) continue
    const rest = [...sorted.slice(0, i), ...sorted.slice(i + 1)]
    const pi = rest.findIndex((t) => tilesEqual(t, sorted[i]))
    if (pi === -1) continue
    const remaining = [...rest.slice(0, pi), ...rest.slice(pi + 1)]
    if (canFormPongsOnly(remaining, setsNeeded)) return true
  }
  return false
}

function isAllSequences(allTiles: Tile[], melds: Meld[]): boolean {
  if (melds.length > 0) return false
  const sorted = sortForBacktrack(allTiles)
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && tilesEqual(sorted[i], sorted[i - 1])) continue
    const rest = [...sorted.slice(0, i), ...sorted.slice(i + 1)]
    const pi = rest.findIndex((t) => tilesEqual(t, sorted[i]))
    if (pi === -1) continue
    const remaining = [...rest.slice(0, pi), ...rest.slice(pi + 1)]
    if (canFormChowsOnly(remaining, 4)) return true
  }
  return false
}

// ── Public API ───────────────────────────────────────────────────────────────

export function getWinResult(hand: Tile[], melds: Meld[], newTile: Tile): string | null {
  const allTiles = [...hand, newTile]
  const setsNeeded = 4 - melds.length

  if (isThirteenOrphans(allTiles)) return '十三幺  Thirteen Orphans'
  if (isSevenPairs(allTiles, melds)) return '七對子  Seven Pairs'

  if (!isStandardWin(allTiles, setsNeeded)) return null

  const allGameTiles = [...allTiles, ...melds.flatMap((m) => m.tiles)]

  if (isBigFourWinds(allTiles, melds))      return '大四喜  Big Four Winds'
  if (isSmallFourWinds(allTiles, melds))    return '小四喜  Small Four Winds'
  if (isBigThreeDragons(allTiles, melds))   return '大三元  Big Three Dragons'
  if (isSmallThreeDragons(allTiles, melds)) return '小三元  Small Three Dragons'
  if (isPureTerminals(allGameTiles))        return '清么九  Pure Terminals'
  if (isAllTriplets(allTiles, melds, setsNeeded)) return '碰碰胡  All Triplets'
  if (isPureOneSuit(allGameTiles))          return '清一色  Pure One Suit'
  if (isHalfOneSuit(allGameTiles))          return '混一色  Half One Suit'
  if (isAllSequences(allTiles, melds))      return '平和  All Sequences'

  return 'Winning Hand'
}

export function canWin(hand: Tile[], melds: Meld[], newTile: Tile): boolean {
  return getWinResult(hand, melds, newTile) !== null
}
