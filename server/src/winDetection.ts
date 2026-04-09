import type { Tile, Meld } from './types'

function isNumericSuit(suit: string): boolean {
  return suit === 'dots' || suit === 'bamboo' || suit === 'characters'
}

function tilesEqual(a: Tile, b: Tile): boolean {
  return a.suit === b.suit && a.value === b.value
}

function sortForBacktrack(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit.localeCompare(b.suit)
    return String(a.value).localeCompare(String(b.value), undefined, { numeric: true })
  })
}

function canFormSets(tiles: Tile[], setsRemaining: number): boolean {
  if (setsRemaining === 0) return tiles.length === 0
  if (tiles.length === 0) return false
  const sorted = sortForBacktrack(tiles)
  const first = sorted[0]
  const rest = sorted.slice(1)

  // Try pong
  const match1 = rest.findIndex((t) => tilesEqual(t, first))
  if (match1 !== -1) {
    const after1 = [...rest.slice(0, match1), ...rest.slice(match1 + 1)]
    const match2 = after1.findIndex((t) => tilesEqual(t, first))
    if (match2 !== -1) {
      const after2 = [...after1.slice(0, match2), ...after1.slice(match2 + 1)]
      if (canFormSets(after2, setsRemaining - 1)) return true
    }
  }

  // Try chow
  if (isNumericSuit(first.suit)) {
    const v = Number(first.value)
    const idx1 = rest.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 1)
    if (idx1 !== -1) {
      const after1 = [...rest.slice(0, idx1), ...rest.slice(idx1 + 1)]
      const idx2 = after1.findIndex((t) => t.suit === first.suit && Number(t.value) === v + 2)
      if (idx2 !== -1) {
        const after2 = [...after1.slice(0, idx2), ...after1.slice(idx2 + 1)]
        if (canFormSets(after2, setsRemaining - 1)) return true
      }
    }
  }

  return false
}

function isStandardWin(tiles: Tile[], setsNeeded: number): boolean {
  const sorted = sortForBacktrack(tiles)
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && tilesEqual(sorted[i], sorted[i - 1])) continue
    const rest = [...sorted.slice(0, i), ...sorted.slice(i + 1)]
    const pairIdx = rest.findIndex((t) => tilesEqual(t, sorted[i]))
    if (pairIdx === -1) continue
    const remaining = [...rest.slice(0, pairIdx), ...rest.slice(pairIdx + 1)]
    if (canFormSets(remaining, setsNeeded)) return true
  }
  return false
}

function isThirteenOrphans(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false
  const orphans: Array<{ suit: string; value: string | number }> = [
    { suit: 'dots', value: 1 }, { suit: 'dots', value: 9 },
    { suit: 'bamboo', value: 1 }, { suit: 'bamboo', value: 9 },
    { suit: 'characters', value: 1 }, { suit: 'characters', value: 9 },
    { suit: 'winds', value: 'east' }, { suit: 'winds', value: 'south' },
    { suit: 'winds', value: 'west' }, { suit: 'winds', value: 'north' },
    { suit: 'dragons', value: 'red' }, { suit: 'dragons', value: 'green' },
    { suit: 'dragons', value: 'white' },
  ]
  const remaining = [...tiles]
  for (const orphan of orphans) {
    const idx = remaining.findIndex((t) => t.suit === orphan.suit && t.value === orphan.value)
    if (idx === -1) return false
    remaining.splice(idx, 1)
  }
  return remaining.length === 1 && orphans.some((o) => remaining[0].suit === o.suit && remaining[0].value === o.value)
}

export function canWin(hand: Tile[], melds: Meld[], newTile: Tile): boolean {
  const allTiles = [...hand, newTile]
  const setsNeeded = 4 - melds.length
  return isStandardWin(allTiles, setsNeeded) || isThirteenOrphans(allTiles)
}

export function canPong(hand: Tile[], discard: Tile): boolean {
  const matches = hand.filter((t) => tilesEqual(t, discard))
  return matches.length >= 2
}

export function canChow(hand: Tile[], discard: Tile): boolean {
  if (!isNumericSuit(discard.suit)) return false
  const v = Number(discard.value)
  const suitTiles = hand.filter((t) => t.suit === discard.suit).map((t) => Number(t.value))
  return (
    (suitTiles.includes(v - 2) && suitTiles.includes(v - 1)) ||
    (suitTiles.includes(v - 1) && suitTiles.includes(v + 1)) ||
    (suitTiles.includes(v + 1) && suitTiles.includes(v + 2))
  )
}

export function canKong(hand: Tile[], discard: Tile): boolean {
  const matches = hand.filter((t) => tilesEqual(t, discard))
  return matches.length >= 3
}
