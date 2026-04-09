import type { Tile } from '../types'

export function tileKey(tile: Pick<Tile, 'suit' | 'value'>): string {
  return `${tile.suit}-${tile.value}`
}

/** Sort tiles: suit order → value order (for display) */
const SUIT_ORDER = ['characters', 'dots', 'bamboo', 'winds', 'dragons', 'flowers', 'seasons']

export function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    const si = SUIT_ORDER.indexOf(a.suit) - SUIT_ORDER.indexOf(b.suit)
    if (si !== 0) return si
    const av = Number(a.value) || windDragonOrder(a)
    const bv = Number(b.value) || windDragonOrder(b)
    return av - bv
  })
}

function windDragonOrder(tile: Tile): number {
  const order: Record<string, number> = {
    east: 1, south: 2, west: 3, north: 4,
    red: 1, green: 2, white: 3,
    plum: 1, orchid: 2, chrysanthemum: 3, bamboo: 4,
    spring: 1, summer: 2, autumn: 3, winter: 4,
  }
  return order[String(tile.value)] ?? 0
}

export function isNumericSuit(suit: Tile['suit']): boolean {
  return suit === 'dots' || suit === 'bamboo' || suit === 'characters'
}

export function tilesEqual(a: Tile, b: Tile): boolean {
  return a.suit === b.suit && a.value === b.value
}
