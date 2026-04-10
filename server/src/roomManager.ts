import type { Room, Player, Seat } from './types'

const rooms = new Map<string, Room>()
const SEATS: Seat[] = ['east', 'south', 'west', 'north']
const BOT_NAMES = ['Mei', 'Zhou', 'Fong', 'Liang']

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code: string
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (rooms.has(code))
  return code
}

export function createRoom(hostId: string, hostName: string): Room {
  const code = generateRoomCode()
  const hostPlayer: Player = {
    id: hostId,
    name: hostName,
    seat: SEATS[0],
    hand: [],
    melds: [],
    flowerTiles: [],
    tileCount: 0,
    score: 0,
    isDealer: true,
    isConnected: true,
  }
  const room: Room = {
    code,
    hostId,
    players: new Map([[hostId, hostPlayer]]),
    botIds: new Set(),
    gameState: null,
    claimTimer: null,
    seatOrder: SEATS,
    chankanPending: null,
  }
  rooms.set(code, room)
  return room
}

export function joinRoom(roomCode: string, playerId: string, playerName: string): Room | null {
  const room = rooms.get(roomCode)
  if (!room) return null
  if (room.players.size >= 4) return null
  if (room.gameState) return null

  // Reconnecting?
  for (const [, p] of room.players) {
    if (p.id === playerId) {
      p.isConnected = true
      return room
    }
  }

  const nextSeatIdx = room.players.size
  const seat = SEATS[nextSeatIdx]
  const player: Player = {
    id: playerId,
    name: playerName,
    seat,
    hand: [],
    melds: [],
    flowerTiles: [],
    tileCount: 0,
    score: 0,
    isDealer: seat === 'east',
    isConnected: true,
  }
  room.players.set(playerId, player)
  return room
}

/** Fill all empty seats with bots. Returns false if room already full. */
export function addBot(room: Room): boolean {
  if (room.players.size >= 4 || room.gameState) return false
  const seatIdx = room.players.size
  const seat = SEATS[seatIdx]
  const botId = `bot-${seat}-${room.code}`
  const botName = BOT_NAMES[seatIdx] + ' (Bot)'
  const bot: Player = {
    id: botId,
    name: botName,
    seat,
    hand: [],
    melds: [],
    flowerTiles: [],
    tileCount: 0,
    score: 0,
    isDealer: seat === 'east',
    isConnected: true,
  }
  room.players.set(botId, bot)
  room.botIds.add(botId)
  return true
}

export function isBot(room: Room, playerId: string): boolean {
  return room.botIds.has(playerId)
}

export function getRoom(roomCode: string): Room | undefined {
  return rooms.get(roomCode)
}

export function getRoomByPlayer(playerId: string): Room | undefined {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) return room
  }
  return undefined
}

export function removePlayer(playerId: string): Room | undefined {
  const room = getRoomByPlayer(playerId)
  if (!room) return undefined
  const player = room.players.get(playerId)
  if (player && !room.botIds.has(player.id)) {
    player.isConnected = false
  }
  return room
}

export function getRoomPlayers(room: Room): Player[] {
  return Array.from(room.players.values())
}

export function getRoomPublicPlayerList(room: Room) {
  return getRoomPlayers(room).map((p) => ({
    id: p.id,
    name: p.name,
    seat: p.seat,
    isConnected: p.isConnected,
    isBot: room.botIds.has(p.id),
  }))
}
