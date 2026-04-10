import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import * as roomManager from './roomManager'
import {
  dealHands,
  applyDiscard,
  applyPong,
  applyChow,
  applyKong,
  applyConcealedKong,
  applyUpgradedKong,
  drawFromWall,
  drawFromWallAutoFlower,
  addTileToHand,
  nextSeat,
  getPublicGameState,
} from './gameEngine'
import { canWin, canPong, canKong, canChow, getWinResult } from './winDetection'
import { botChooseDiscard, botDecideClaim } from './botAI'
import type { ServerGameState, Seat, ClaimType } from './types'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

const CLAIM_TIMEOUT_MS = 15000
const BOT_THINK_MS = 2000  // delay before bot acts

// ── Bot helpers ──────────────────────────────────────────────────────────────

function scheduleBotTurn(roomCode: string) {
  const room = roomManager.getRoom(roomCode)
  if (!room?.gameState) return
  const gs = room.gameState
  if (gs.phase !== 'playing') return

  const currentPlayer = gs.players.find((p) => p.seat === gs.currentTurn)
  if (!currentPlayer || !roomManager.isBot(room, currentPlayer.id)) return

  setTimeout(() => {
    const r = roomManager.getRoom(roomCode)
    if (!r?.gameState || r.gameState.phase !== 'playing') return
    if (r.gameState.currentTurn !== currentPlayer.seat) return

    // Bot draws (auto-replace flowers)
    const { tile, newState, bonusTiles: _botBonus } = drawFromWallAutoFlower(r.gameState, currentPlayer.seat)
    if (!tile) {
      io.to(roomCode).emit('game-over', {
        winner: null, winningHand: null, winType: 'draw',
        scores: Object.fromEntries(r.gameState.players.map((p) => [p.seat, p.score])),
        playerHands: Object.fromEntries(r.gameState.players.map((p) => [p.seat, p.hand])),
      })
      r.gameState = { ...newState, phase: 'finished' }
      return
    }

    r.gameState = addTileToHand(newState, currentPlayer.seat, tile)
    const botPlayer = r.gameState.players.find((p) => p.seat === currentPlayer.seat)!

    // Small pause then discard
    setTimeout(() => {
      const r2 = roomManager.getRoom(roomCode)
      if (!r2?.gameState) return

      // Check self-draw win
      const botHandWithoutDraw = botPlayer.hand.filter((t) => t.id !== tile.id)
      const botWinResult = getWinResult(botHandWithoutDraw, botPlayer.melds, tile)
      if (botWinResult) {
        r2.gameState = { ...r2.gameState, phase: 'finished', winner: currentPlayer.seat, winningHand: botPlayer.hand }
        io.to(roomCode).emit('game-over', {
          winner: currentPlayer.seat,
          winningHand: botPlayer.hand,
          winType: 'self-draw',
          scores: Object.fromEntries(r2.gameState.players.map((p) => [p.seat, p.score])),
          playerHands: Object.fromEntries(r2.gameState.players.map((p) => [p.seat, p.hand])),
          handName: botWinResult,
        })
        return
      }

      const discardTile = botChooseDiscard(botPlayer.hand)
      const { newState: afterDiscard, discardedTile } = applyDiscard(r2.gameState, currentPlayer.seat, discardTile.id)
      if (!discardedTile) return

      r2.gameState = afterDiscard
      r2.gameState.pendingClaims = new Map()

      const opponents = afterDiscard.players.filter((p) => p.id !== currentPlayer.id)
      const anyClaim = opponents.some(
        (p) => canWin(p.hand, p.melds, discardedTile) || canPong(p.hand, discardedTile) ||
               canKong(p.hand, discardedTile) || canChow(p.hand, discardedTile)
      )

      io.to(roomCode).emit('tile-discarded', {
        by: currentPlayer.seat,
        tile: discardedTile,
        claimWindow: anyClaim,
        newDiscardPile: afterDiscard.discardPile,
      })

      if (anyClaim) {
        startClaimWindow(roomCode)
        // Schedule bot claims for any bot opponents
        scheduleBotClaims(roomCode, discardedTile)
      } else {
        advanceTurn(roomCode)
      }
    }, BOT_THINK_MS / 2)
  }, BOT_THINK_MS)
}

function scheduleBotClaims(roomCode: string, discardTile: import('./types').Tile) {
  const room = roomManager.getRoom(roomCode)
  if (!room?.gameState) return

  for (const player of room.gameState.players) {
    if (!roomManager.isBot(room, player.id)) continue
    if (player.seat === room.gameState.lastDiscardBy) continue

    const decision = botDecideClaim(player.hand, player.melds, discardTile)
    const delay = Math.floor(Math.random() * 800) + 400

    setTimeout(() => {
      const r = roomManager.getRoom(roomCode)
      if (!r?.gameState || r.gameState.phase !== 'claiming') return
      r.gameState.pendingClaims.set(player.id, { claimType: decision })
      resolveClaims(roomCode)
    }, delay)
  }
}

// ── Socket handlers ──────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('[connect]', socket.id)

  socket.on('create-room', ({ playerName }: { playerName: string }) => {
    const room = roomManager.createRoom(socket.id, playerName)
    socket.join(room.code)
    socket.emit('room-update', {
      roomCode: room.code,
      players: roomManager.getRoomPublicPlayerList(room),
      hostId: room.hostId,
    })
  })

  socket.on('join-room', ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
    const room = roomManager.joinRoom(roomCode, socket.id, playerName)
    if (!room) {
      socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found or full' })
      return
    }
    socket.join(roomCode)
    io.to(roomCode).emit('room-update', {
      roomCode: room.code,
      players: roomManager.getRoomPublicPlayerList(room),
      hostId: room.hostId,
    })
  })

  socket.on('add-bot', () => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room || room.hostId !== socket.id) return
    const added = roomManager.addBot(room)
    if (added) {
      io.to(room.code).emit('room-update', {
        roomCode: room.code,
        players: roomManager.getRoomPublicPlayerList(room),
        hostId: room.hostId,
      })
    }
  })

  socket.on('game-start', () => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room || room.hostId !== socket.id) return
    if (room.players.size !== 4) {
      socket.emit('error', { code: 'NOT_ENOUGH_PLAYERS', message: 'Need 4 players to start' })
      return
    }

    const players = roomManager.getRoomPlayers(room)
    const { players: dealtPlayers, wall } = dealHands(
      players.map((p) => p.id),
      players.map((p) => p.name),
      players.map((p) => p.seat) as Seat[]
    )

    const gameState: ServerGameState = {
      roomCode: room.code,
      phase: 'playing',
      players: dealtPlayers,
      currentTurn: 'east',
      lastDiscard: null,
      lastDiscardBy: null,
      discardPile: [],
      wallCount: wall.length,
      roundWind: 'east',
      roundNumber: 1,
      winner: null,
      winningHand: null,
      wall,
      pendingClaims: new Map(),
    }
    room.gameState = gameState

    // Send each human player their private hand
    for (const player of dealtPlayers) {
      if (roomManager.isBot(room, player.id)) continue
      const playerSocket = io.sockets.sockets.get(player.id)
      if (playerSocket) {
        playerSocket.emit('game-start', {
          gameState: getPublicGameState(gameState),
          yourHand: player.hand,
        })
      }
    }

    // Kick off bot turn if east is a bot
    scheduleBotTurn(room.code)
  })

  socket.on('draw-tile', () => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room?.gameState) return
    const gs = room.gameState
    const player = gs.players.find((p) => p.id === socket.id)
    if (!player || player.seat !== gs.currentTurn || gs.phase !== 'playing') return
    if (player.hand.length % 3 !== 1) return

    const { tile, newState, bonusTiles } = drawFromWallAutoFlower(gs, player.seat)
    if (!tile) {
      io.to(room.code).emit('game-over', {
        winner: null, winningHand: null, winType: 'draw',
        scores: Object.fromEntries(gs.players.map((p) => [p.seat, p.score])),
        playerHands: Object.fromEntries(gs.players.map((p) => [p.seat, p.hand])),
      })
      room.gameState = { ...newState, phase: 'finished' }
      return
    }

    room.gameState = addTileToHand(newState, player.seat, tile)
    // Broadcast updated public state (flowerTiles counts changed)
    if (bonusTiles.length > 0) {
      io.to(room.code).emit('claim-result', {
        claimedBy: null, claimType: 'pass' as ClaimType,
        updatedGameState: getPublicGameState(room.gameState),
      })
    }
    socket.emit('tile-drawn', { tile, newWallCount: room.gameState.wall.length, bonusTiles })
  })

  socket.on('declare-win', () => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room?.gameState) return
    const gs = room.gameState
    const player = gs.players.find((p) => p.id === socket.id)
    if (!player || player.seat !== gs.currentTurn || gs.phase !== 'playing') return
    if (player.hand.length % 3 !== 2) return // must have drawn

    // The drawn tile is the last in hand
    const drawnTile = player.hand[player.hand.length - 1]
    const handWithoutDraw = player.hand.slice(0, -1)
    const winResult = getWinResult(handWithoutDraw, player.melds, drawnTile)
    if (!winResult) return

    const winHand = [...player.hand]
    room.gameState = { ...gs, phase: 'finished', winner: player.seat, winningHand: winHand }
    io.to(room.code).emit('game-over', {
      winner: player.seat,
      winningHand: winHand,
      winType: 'self-draw',
      scores: Object.fromEntries(gs.players.map((p) => [p.seat, p.score])),
      playerHands: Object.fromEntries(gs.players.map((p) =>
        [p.seat, p.seat === player.seat ? winHand : p.hand]
      )),
      handName: winResult,
    })
  })

  socket.on('discard-tile', ({ tileId }: { tileId: string }) => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room?.gameState) return
    const gs = room.gameState
    const player = gs.players.find((p) => p.id === socket.id)
    if (!player || player.seat !== gs.currentTurn) return

    const { newState, discardedTile } = applyDiscard(gs, player.seat, tileId)
    if (!discardedTile) return

    room.gameState = newState
    room.gameState.pendingClaims = new Map()

    const opponents = newState.players.filter((p) => p.id !== socket.id)
    const anyClaim = opponents.some(
      (p) => canWin(p.hand, p.melds, discardedTile) || canPong(p.hand, discardedTile) ||
             canKong(p.hand, discardedTile) || canChow(p.hand, discardedTile)
    )

    io.to(room.code).emit('tile-discarded', {
      by: player.seat,
      tile: discardedTile,
      claimWindow: anyClaim,
      newDiscardPile: newState.discardPile,
    })

    if (anyClaim) {
      startClaimWindow(room.code)
      scheduleBotClaims(room.code, discardedTile)
    } else {
      advanceTurn(room.code)
    }
  })

  socket.on('claim', ({ claimType, chowTileIds }: { claimType: Exclude<ClaimType, 'pass'>; chowTileIds?: [string, string] }) => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room?.gameState || room.gameState.phase !== 'claiming') return
    room.gameState.pendingClaims.set(socket.id, { claimType, chowTileIds })
    resolveClaims(room.code)
  })

  socket.on('pass', () => {
    const room = roomManager.getRoomByPlayer(socket.id)
    if (!room?.gameState || room.gameState.phase !== 'claiming') return
    room.gameState.pendingClaims.set(socket.id, { claimType: 'pass' })
    resolveClaims(room.code)
  })

  socket.on('disconnect', () => {
    console.log('[disconnect]', socket.id)
    const room = roomManager.removePlayer(socket.id)
    if (room) {
      io.to(room.code).emit('room-update', {
        roomCode: room.code,
        players: roomManager.getRoomPublicPlayerList(room),
        hostId: room.hostId,
      })
    }
  })
})

// ── Claim resolution ─────────────────────────────────────────────────────────

function startClaimWindow(roomCode: string, timeoutMs = CLAIM_TIMEOUT_MS) {
  const room = roomManager.getRoom(roomCode)
  if (!room) return
  if (room.claimTimer) clearTimeout(room.claimTimer)
  room.claimTimer = setTimeout(() => {
    const gs = room.gameState
    if (!gs || gs.phase !== 'claiming') return
    // Auto-pass anyone (human or bot) who hasn't responded
    for (const p of gs.players) {
      if (p.seat !== gs.lastDiscardBy && !gs.pendingClaims.has(p.id)) {
        gs.pendingClaims.set(p.id, { claimType: 'pass' })
      }
    }
    resolveClaims(roomCode)
  }, CLAIM_TIMEOUT_MS)
}

function resolveClaims(roomCode: string) {
  const room = roomManager.getRoom(roomCode)
  if (!room?.gameState) return
  const gs = room.gameState
  if (gs.phase !== 'claiming') return

  const nonDiscarders = gs.players.filter((p) => p.seat !== gs.lastDiscardBy)
  if (gs.pendingClaims.size < nonDiscarders.length) return

  if (room.claimTimer) { clearTimeout(room.claimTimer); room.claimTimer = null }

  const discardTile = gs.lastDiscard!
  type Entry = { playerId: string; seat: Seat; claimType: ClaimType; chowTileIds?: [string, string] }
  const entries: Entry[] = []

  for (const [playerId, claim] of gs.pendingClaims) {
    if (claim.claimType === 'pass') continue
    const p = gs.players.find((pl) => pl.id === playerId)
    if (!p) continue
    entries.push({ playerId, seat: p.seat, claimType: claim.claimType, chowTileIds: claim.chowTileIds })
  }

  const priority: Record<string, number> = { win: 4, kong: 3, pong: 2, chow: 1 }
  entries.sort((a, b) => (priority[b.claimType] ?? 0) - (priority[a.claimType] ?? 0))

  const winning = entries[0]

  if (!winning) { advanceTurn(roomCode); return }

  const claimer = gs.players.find((p) => p.id === winning.playerId)!

  if (winning.claimType === 'win') {
    const winResult = getWinResult(claimer.hand, claimer.melds, discardTile)
    if (winResult) {
      const winHand = [...claimer.hand, discardTile]
      room.gameState = { ...gs, phase: 'finished', winner: claimer.seat, winningHand: winHand }
      const handsAtEnd = Object.fromEntries(gs.players.map((p) =>
        [p.seat, p.seat === claimer.seat ? winHand : p.hand]
      ))
      io.to(roomCode).emit('game-over', {
        winner: claimer.seat, winningHand: winHand, winType: 'discard',
        scores: Object.fromEntries(gs.players.map((p) => [p.seat, p.score])),
        playerHands: handsAtEnd,
        handName: winResult,
      })
      return
    }
  } else if (winning.claimType === 'pong') {
    const newState = applyPong(gs, claimer.seat, discardTile)
    room.gameState = newState
    const updatedClaimer = newState.players.find((p) => p.id === winning.playerId)!

    io.to(roomCode).emit('claim-result', {
      claimedBy: claimer.seat, claimType: 'pong',
      updatedGameState: getPublicGameState(newState),
    })

    // Send updated private hand to the claimer (if human)
    if (!roomManager.isBot(room, winning.playerId)) {
      const claimerSocket = io.sockets.sockets.get(winning.playerId)
      claimerSocket?.emit('hand-update', { hand: updatedClaimer.hand })
    }

    // If pong claimer is a bot, schedule their next discard
    if (roomManager.isBot(room, winning.playerId)) {
      setTimeout(() => {
        const r = roomManager.getRoom(roomCode)
        if (!r?.gameState) return
        const bp = r.gameState.players.find((p) => p.id === winning.playerId)!
        const discardChoice = botChooseDiscard(bp.hand)
        const { newState: afterDiscard, discardedTile } = applyDiscard(r.gameState, claimer.seat, discardChoice.id)
        if (!discardedTile) return
        r.gameState = afterDiscard
        r.gameState.pendingClaims = new Map()
        const opponents = afterDiscard.players.filter((p) => p.id !== winning.playerId)
        const anyClaim = opponents.some(
          (p) => canWin(p.hand, p.melds, discardedTile) || canPong(p.hand, discardedTile)
        )
        io.to(roomCode).emit('tile-discarded', {
          by: claimer.seat, tile: discardedTile, claimWindow: anyClaim,
          newDiscardPile: afterDiscard.discardPile,
        })
        if (anyClaim) { startClaimWindow(roomCode); scheduleBotClaims(roomCode, discardedTile) }
        else advanceTurn(roomCode)
      }, BOT_THINK_MS)
    }
    return
  } else if (winning.claimType === 'kong') {
    // Claimed Gong: apply, draw replacement from wall
    const afterKong = applyKong(gs, claimer.seat, discardTile)
    const { tile: replacement, newState: afterDraw } = drawFromWall(afterKong)
    if (!replacement) {
      room.gameState = { ...afterKong, phase: 'finished' }
      io.to(roomCode).emit('game-over', {
        winner: null, winningHand: null, winType: 'draw',
        scores: Object.fromEntries(gs.players.map((p) => [p.seat, p.score])),
        playerHands: Object.fromEntries(afterKong.players.map((p) => [p.seat, p.hand])),
      })
      return
    }
    const stateAfterKong = addTileToHand(afterDraw, claimer.seat, replacement)
    room.gameState = stateAfterKong
    const updatedClaimer = stateAfterKong.players.find((p) => p.id === winning.playerId)!
    io.to(roomCode).emit('claim-result', {
      claimedBy: claimer.seat, claimType: 'kong',
      updatedGameState: getPublicGameState(stateAfterKong),
    })
    if (!roomManager.isBot(room, winning.playerId)) {
      io.sockets.sockets.get(winning.playerId)?.emit('hand-update', { hand: updatedClaimer.hand })
    }
    if (roomManager.isBot(room, winning.playerId)) {
      setTimeout(() => {
        const r = roomManager.getRoom(roomCode)
        if (!r?.gameState) return
        const bp = r.gameState.players.find((p) => p.id === winning.playerId)!
        const discardChoice = botChooseDiscard(bp.hand)
        const { newState: afterDiscard, discardedTile } = applyDiscard(r.gameState, claimer.seat, discardChoice.id)
        if (!discardedTile) return
        r.gameState = afterDiscard
        r.gameState.pendingClaims = new Map()
        const opponents = afterDiscard.players.filter((p) => p.id !== winning.playerId)
        const anyClaim = opponents.some((p) =>
          canWin(p.hand, p.melds, discardedTile) || canPong(p.hand, discardedTile) || canKong(p.hand, discardedTile)
        )
        io.to(roomCode).emit('tile-discarded', {
          by: claimer.seat, tile: discardedTile, claimWindow: anyClaim,
          newDiscardPile: afterDiscard.discardPile,
        })
        if (anyClaim) { startClaimWindow(roomCode); scheduleBotClaims(roomCode, discardedTile) }
        else advanceTurn(roomCode)
      }, BOT_THINK_MS)
    }
    return
  } else if (winning.claimType === 'chow' && winning.chowTileIds) {
    const newState = applyChow(gs, claimer.seat, discardTile, winning.chowTileIds)
    room.gameState = newState
    const updatedChowClaimer = newState.players.find((p) => p.id === winning.playerId)!
    io.to(roomCode).emit('claim-result', {
      claimedBy: claimer.seat, claimType: 'chow',
      updatedGameState: getPublicGameState(newState),
    })
    if (!roomManager.isBot(room, winning.playerId)) {
      const claimerSocket = io.sockets.sockets.get(winning.playerId)
      claimerSocket?.emit('hand-update', { hand: updatedChowClaimer.hand })
    }
    return
  }

  advanceTurn(roomCode)
}

function advanceTurn(roomCode: string) {
  const room = roomManager.getRoom(roomCode)
  if (!room?.gameState) return
  const gs = room.gameState
  const next = nextSeat(gs.currentTurn)
  room.gameState = { ...gs, currentTurn: next, phase: 'playing', pendingClaims: new Map() }

  io.to(roomCode).emit('claim-result', {
    claimedBy: null, claimType: 'pass' as ClaimType,
    updatedGameState: getPublicGameState(room.gameState),
  })

  // If next player is a bot, schedule their turn
  scheduleBotTurn(roomCode)
}

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3001
httpServer.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`)
})
