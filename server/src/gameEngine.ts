import type { Tile, Suit, Seat, Player, Meld, ServerGameState } from './types'

const SEATS: Seat[] = ['east', 'south', 'west', 'north']

function makeTile(suit: Suit, value: number | string, copyIdx: number): Tile {
  return { id: `${suit}-${value}-${copyIdx}`, suit, value }
}

export function createDeck(): Tile[] {
  const deck: Tile[] = []

  // 4 copies of numeric suits (dots, bamboo, characters), values 1-9
  for (const suit of ['dots', 'bamboo', 'characters'] as Suit[]) {
    for (let v = 1; v <= 9; v++) {
      for (let c = 0; c < 4; c++) {
        deck.push(makeTile(suit, v, c))
      }
    }
  }

  // 4 copies of each wind
  for (const wind of ['east', 'south', 'west', 'north']) {
    for (let c = 0; c < 4; c++) {
      deck.push(makeTile('winds', wind, c))
    }
  }

  // 4 copies of each dragon
  for (const dragon of ['red', 'green', 'white']) {
    for (let c = 0; c < 4; c++) {
      deck.push(makeTile('dragons', dragon, c))
    }
  }

  // 1 copy of each bonus tile (flowers + seasons)
  for (const flower of ['plum', 'orchid', 'chrysanthemum', 'bamboo']) {
    deck.push(makeTile('flowers', flower, 0))
  }
  for (const season of ['spring', 'summer', 'autumn', 'winter']) {
    deck.push(makeTile('seasons', season, 0))
  }

  return deck
}

export function shuffleDeck(deck: Tile[]): Tile[] {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isBonusTile(tile: Tile): boolean {
  return tile.suit === 'flowers' || tile.suit === 'seasons'
}

export function dealHands(
  playerIds: string[],
  playerNames: string[],
  seats: Seat[]
): { players: Player[]; wall: Tile[] } {
  const deck = shuffleDeck(createDeck())

  // Deal: east gets 14 (dealer), others 13
  const hands: Record<Seat, Tile[]> = { east: [], south: [], west: [], north: [] }
  let wallStart = 0

  for (const seat of seats) {
    const count = seat === 'east' ? 14 : 13
    hands[seat] = deck.slice(wallStart, wallStart + count)
    wallStart += count
  }

  let wall = deck.slice(wallStart)

  // Replace bonus tiles: draw from front of wall, bonus tiles go to bonus pile
  const flowersByseat: Record<Seat, Tile[]> = { east: [], south: [], west: [], north: [] }
  for (const seat of seats) {
    const hand = hands[seat]
    let i = 0
    while (i < hand.length) {
      if (isBonusTile(hand[i])) {
        flowersByseat[seat].push(hand.splice(i, 1)[0])
        // Draw replacement from end of wall (kan draw position)
        if (wall.length > 0) {
          hand.push(wall.pop()!)
        }
      } else {
        i++
      }
    }
  }

  const players: Player[] = seats.map((seat, idx) => ({
    id: playerIds[idx],
    name: playerNames[idx],
    seat,
    hand: hands[seat],
    melds: [],
    flowerTiles: flowersByseat[seat],
    tileCount: hands[seat].length,
    score: 0,
    isDealer: seat === 'east',
    isConnected: true,
  }))

  return { players, wall }
}

export function applyPong(
  state: ServerGameState,
  claimerSeat: Seat,
  discardTile: Tile
): ServerGameState {
  const players = state.players.map((p) => {
    if (p.seat !== claimerSeat) return p
    // Remove 2 matching tiles from hand
    let removed = 0
    const newHand = p.hand.filter((t) => {
      if (removed < 2 && t.suit === discardTile.suit && t.value === discardTile.value) {
        removed++
        return false
      }
      return true
    })
    const meld: Meld = {
      type: 'pong',
      tiles: [discardTile, ...p.hand.filter((t, i) => {
        let count = 0
        for (let j = 0; j < i; j++) {
          if (p.hand[j].suit === discardTile.suit && p.hand[j].value === discardTile.value) count++
        }
        return t.suit === discardTile.suit && t.value === discardTile.value && count < 2
      }).slice(0, 2)],
    }
    return { ...p, hand: newHand, melds: [...p.melds, meld], tileCount: newHand.length }
  })

  // Remove last discard from discard pile
  const discardPile = state.discardPile.filter((t) => t.id !== discardTile.id)

  return {
    ...state,
    players,
    discardPile,
    lastDiscard: null,
    lastDiscardBy: null,
    currentTurn: claimerSeat,
    phase: 'playing',
  }
}

// Claimed Gong — someone discards the 4th tile you needed
export function applyKong(
  state: ServerGameState,
  claimerSeat: Seat,
  discardTile: Tile
): ServerGameState {
  const players = state.players.map((p) => {
    if (p.seat !== claimerSeat) return p
    let removed = 0
    const meldTiles: Tile[] = []
    const newHand = p.hand.filter((t) => {
      if (removed < 3 && t.suit === discardTile.suit && t.value === discardTile.value) {
        removed++; meldTiles.push(t); return false
      }
      return true
    })
    const meld: Meld = { type: 'kong', tiles: [discardTile, ...meldTiles] }
    return { ...p, hand: newHand, melds: [...p.melds, meld], tileCount: newHand.length }
  })
  return {
    ...state,
    players,
    discardPile: state.discardPile.filter((t) => t.id !== discardTile.id),
    lastDiscard: null, lastDiscardBy: null,
    currentTurn: claimerSeat, phase: 'playing',
  }
}

// Concealed Gong — 4 tiles all from your own hand (middle 2 shown face-down)
export function applyConcealedKong(
  state: ServerGameState,
  seat: Seat,
  suit: string,
  value: string | number
): ServerGameState {
  const players = state.players.map((p) => {
    if (p.seat !== seat) return p
    let removed = 0
    const meldTiles: Tile[] = []
    const newHand = p.hand.filter((t) => {
      if (removed < 4 && t.suit === suit && t.value === value) {
        removed++; meldTiles.push(t); return false
      }
      return true
    })
    const meld: Meld = { type: 'concealed-kong', tiles: meldTiles }
    return { ...p, hand: newHand, melds: [...p.melds, meld], tileCount: newHand.length }
  })
  return { ...state, players }
}

// Upgraded Gong — you already have an exposed Pong and draw the 4th tile
export function applyUpgradedKong(
  state: ServerGameState,
  seat: Seat,
  tile: Tile
): ServerGameState {
  const players = state.players.map((p) => {
    if (p.seat !== seat) return p
    const newHand = p.hand.filter((t) => t.id !== tile.id)
    const melds = p.melds.map((m) => {
      if (m.type === 'pong' && m.tiles[0].suit === tile.suit && m.tiles[0].value === tile.value) {
        return { ...m, type: 'kong' as Meld['type'], tiles: [...m.tiles, tile] }
      }
      return m
    })
    return { ...p, hand: newHand, melds, tileCount: newHand.length }
  })
  return { ...state, players }
}

export function applyChow(
  state: ServerGameState,
  claimerSeat: Seat,
  discardTile: Tile,
  handTileIds: [string, string]
): ServerGameState {
  const players = state.players.map((p) => {
    if (p.seat !== claimerSeat) return p
    const meldTiles: Tile[] = [discardTile]
    const newHand = p.hand.filter((t) => {
      if (handTileIds.includes(t.id)) {
        meldTiles.push(t)
        return false
      }
      return true
    })
    // Sort meld tiles by value
    meldTiles.sort((a, b) => Number(a.value) - Number(b.value))
    const meld: Meld = { type: 'chow', tiles: meldTiles }
    return { ...p, hand: newHand, melds: [...p.melds, meld], tileCount: newHand.length }
  })

  const discardPile = state.discardPile.filter((t) => t.id !== discardTile.id)

  return {
    ...state,
    players,
    discardPile,
    lastDiscard: null,
    lastDiscardBy: null,
    currentTurn: claimerSeat,
    phase: 'playing',
  }
}

export function applyDiscard(
  state: ServerGameState,
  discardingPlayer: Seat,
  tileId: string
): { newState: ServerGameState; discardedTile: Tile } {
  let discardedTile!: Tile

  const players = state.players.map((p) => {
    if (p.seat !== discardingPlayer) return p
    const tileIdx = p.hand.findIndex((t) => t.id === tileId)
    if (tileIdx === -1) return p
    discardedTile = p.hand[tileIdx]
    const newHand = p.hand.filter((_, i) => i !== tileIdx)
    return { ...p, hand: newHand, tileCount: newHand.length }
  })

  const newDiscardPile = [...state.discardPile, discardedTile]

  return {
    newState: {
      ...state,
      players,
      discardPile: newDiscardPile,
      lastDiscard: discardedTile,
      lastDiscardBy: discardingPlayer,
      phase: 'claiming',
    },
    discardedTile,
  }
}

export function drawFromWall(state: ServerGameState): { tile: Tile | null; newState: ServerGameState } {
  if (state.wall.length === 0) return { tile: null, newState: state }
  const [tile, ...rest] = state.wall
  return { tile, newState: { ...state, wall: rest, wallCount: rest.length } }
}

/**
 * Draw from wall, auto-replacing any bonus (flower/season) tiles and adding
 * them to the player's flowerTiles. Returns the first non-bonus tile drawn
 * (or null if wall exhausted), plus any bonus tiles picked up along the way.
 */
export function drawFromWallAutoFlower(
  state: ServerGameState,
  seat: Seat
): { tile: Tile | null; newState: ServerGameState; bonusTiles: Tile[] } {
  let current = state
  const bonusTiles: Tile[] = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (current.wall.length === 0) return { tile: null, newState: current, bonusTiles }
    const [drawn, ...rest] = current.wall
    current = { ...current, wall: rest, wallCount: rest.length }

    if (isBonusTile(drawn)) {
      bonusTiles.push(drawn)
      // Add to player's flowerTiles
      current = {
        ...current,
        players: current.players.map((p) =>
          p.seat === seat ? { ...p, flowerTiles: [...p.flowerTiles, drawn] } : p
        ),
      }
      // Loop to draw replacement
    } else {
      return { tile: drawn, newState: current, bonusTiles }
    }
  }
}

export function addTileToHand(state: ServerGameState, seat: Seat, tile: Tile): ServerGameState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.seat === seat
        ? { ...p, hand: [...p.hand, tile], tileCount: p.hand.length + 1 }
        : p
    ),
  }
}

export function nextSeat(seat: Seat): Seat {
  const idx = SEATS.indexOf(seat)
  return SEATS[(idx + 1) % 4]
}

export function getPublicGameState(state: ServerGameState) {
  return {
    roomCode: state.roomCode,
    phase: state.phase,
    players: state.players.map((p) => ({
      ...p,
      hand: [], // strip private hand
    })),
    currentTurn: state.currentTurn,
    lastDiscard: state.lastDiscard,
    lastDiscardBy: state.lastDiscardBy,
    discardPile: state.discardPile,
    wallCount: state.wall.length,
    roundWind: state.roundWind,
    roundNumber: state.roundNumber,
    winner: state.winner,
    winningHand: state.winningHand,
  }
}
