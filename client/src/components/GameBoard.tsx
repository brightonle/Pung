import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import type { Player, Seat, Tile } from '../types'
import OpponentHand from './OpponentHand'
import DiscardPile from './DiscardPile'
import DrawPile from './DrawPile'
import PlayerHand from './PlayerHand'
import ActionButtons from './ActionButtons'
import MeldGroup from './MeldGroup'
import MahjongTile from './MahjongTile'

const SUIT_ORDER = ['dots', 'bamboo', 'characters', 'winds', 'dragons', 'flowers', 'seasons']

function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    const sd = SUIT_ORDER.indexOf(a.suit) - SUIT_ORDER.indexOf(b.suit)
    if (sd !== 0) return sd
    const av = Number(a.value), bv = Number(b.value)
    if (!isNaN(av) && !isNaN(bv)) return av - bv
    return String(a.value).localeCompare(String(b.value))
  })
}

const SEAT_WIND: Record<Seat, string> = {
  east: '東',
  south: '南',
  west: '西',
  north: '北',
}

export default function GameBoard() {
  const gameState = useGameStore((s) => s.gameState)
  const myHand = useGameStore((s) => s.myHand)
  const socketId = useGameStore((s) => s.socketId)
  const claimAnimation = useGameStore((s) => s.claimAnimation)
  const setClaimAnimation = useGameStore((s) => s.setClaimAnimation)
  const winningHandName = useGameStore((s) => s.winningHandName)
  const { drawTile } = useGameActions()

  // Clear claim animation after it finishes
  useEffect(() => {
    if (!claimAnimation) return
    const t = setTimeout(() => setClaimAnimation(null), 700)
    return () => clearTimeout(t)
  }, [claimAnimation, setClaimAnimation])

  if (!gameState) return null

  const myPlayer = gameState.players.find((p) => p.id === socketId)
  if (!myPlayer) return null

  const isMyTurn = myPlayer.seat === gameState.currentTurn && gameState.phase === 'playing'
  // post-draw hand size is always % 3 === 2 (14, 11, 8, ... depending on melds formed)
  const hasDrawnThisTurn = myHand.length % 3 === 2

  // Arrange opponents relative to my seat
  const seats: Seat[] = ['east', 'south', 'west', 'north']
  const myIdx = seats.indexOf(myPlayer.seat)
  const leftSeat = seats[(myIdx + 1) % 4]
  const topSeat = seats[(myIdx + 2) % 4]
  const rightSeat = seats[(myIdx + 3) % 4]

  const playerBySeat = (seat: Seat): Player | undefined =>
    gameState.players.find((p) => p.seat === seat)

  const leftPlayer = playerBySeat(leftSeat)
  const topPlayer = playerBySeat(topSeat)
  const rightPlayer = playerBySeat(rightSeat)

  // Win overlay — reveal all hands
  if (gameState.phase === 'finished') {
    const winnerPlayer = gameState.winner ? playerBySeat(gameState.winner) : null
    const isMe = gameState.winner === myPlayer.seat
    const orderedSeats: Seat[] = ['east', 'south', 'west', 'north']
    return (
      <div className="fixed inset-0 bg-[#111] overflow-y-auto z-50">
        <div className="min-h-full flex flex-col items-center justify-start py-8 px-4 gap-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-white/30 text-xs uppercase tracking-widest mb-1">
              {gameState.winner ? (isMe ? 'You win!' : `${winnerPlayer?.name ?? 'Someone'} wins`) : 'Draw'}
            </div>
            <div className="text-white text-4xl font-bold mb-1">
              {gameState.winner ? (isMe ? '🀄' : SEAT_WIND[gameState.winner]) : '—'}
            </div>
            {winningHandName && (
              <div className="text-white/70 text-base font-medium tracking-wide">
                {winningHandName}
              </div>
            )}
          </div>

          {/* All player hands */}
          <div className="w-full max-w-lg flex flex-col gap-4">
            {orderedSeats.map((seat) => {
              const p = playerBySeat(seat)
              if (!p) return null
              const isWinner = seat === gameState.winner
              const showHand = p.id === myPlayer.id ? myHand : p.hand
              return (
                <div key={seat}
                  className={`rounded-xl p-3 border ${isWinner ? 'border-white/30 bg-white/5' : 'border-white/[0.06] bg-white/[0.02]'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold ${isWinner ? 'text-white' : 'text-white/50'}`}>{p.name}</span>
                    <span className="text-white/20 text-[10px]">{SEAT_WIND[seat]}</span>
                    {isWinner && <span className="text-white/40 text-[10px] uppercase tracking-widest">winner</span>}
                  </div>
                  <div className="flex flex-wrap gap-[2px]">
                    {sortTiles(showHand).map((tile) => (
                      <MahjongTile key={tile.id} suit={tile.suit} value={tile.value} scale={0.5} />
                    ))}
                    {p.melds.map((meld, i) => (
                      <div key={`meld-${i}`} className="flex gap-[2px] ml-2 border-l border-white/10 pl-2">
                        {meld.tiles.map((tile, j) => (
                          <MahjongTile key={j} suit={tile.suit} value={tile.value}
                            faceDown={meld.type === 'concealed-kong' && (j === 0 || j === 3)} scale={0.5} />
                        ))}
                      </div>
                    ))}
                  </div>
                  {p.flowerTiles.length > 0 && (
                    <div className="flex flex-wrap gap-[2px] mt-2 pt-2 border-t border-white/5">
                      <span className="text-white/20 text-[9px] uppercase tracking-widest self-center mr-1">Flowers</span>
                      {p.flowerTiles.map((tile) => (
                        <MahjongTile key={tile.id} suit={tile.suit} value={tile.value} scale={0.45} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const bottomHandHeight = Math.round(90) + 28
  const boardBottom = bottomHandHeight

  // Active-player directional glow
  const activeDir =
    gameState.currentTurn === topSeat ? 'top' :
    gameState.currentTurn === leftSeat ? 'left' :
    gameState.currentTurn === rightSeat ? 'right' :
    gameState.currentTurn === myPlayer.seat ? 'bottom' : null

  const glowGradient: Record<string, string> = {
    top:    'radial-gradient(ellipse 70% 30% at 50% 0%,   rgba(255,255,255,0.10) 0%, transparent 100%)',
    left:   'radial-gradient(ellipse 30% 70% at 0% 50%,   rgba(255,255,255,0.10) 0%, transparent 100%)',
    right:  'radial-gradient(ellipse 30% 70% at 100% 50%, rgba(255,255,255,0.10) 0%, transparent 100%)',
    bottom: 'radial-gradient(ellipse 70% 30% at 50% 100%, rgba(255,255,255,0.10) 0%, transparent 100%)',
  }

  return (
    <div
      className="fixed inset-0 bg-[#111] overflow-hidden"
      style={{ paddingBottom: boardBottom }}
    >
      {/* ── Active player glow ────────────────────────────── */}
      {activeDir && (
        <div
          className="turn-glow absolute inset-0 z-0"
          style={{ background: glowGradient[activeDir] }}
        />
      )}

      {/* ── Top opponent ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-3 pb-1">
        {topPlayer && (
          <>
            <OpponentHand
              name={topPlayer.name}
              tileCount={topPlayer.tileCount}
              isActive={gameState.currentTurn === topSeat}
              position="top"
            />
            {topPlayer.melds.length > 0 && <MeldGroup melds={topPlayer.melds} scale={0.45} />}
            {topPlayer.flowerTiles.length > 0 && (
              <div className="flex gap-[2px] mt-1">
                {topPlayer.flowerTiles.map((t) => (
                  <MahjongTile key={t.id} suit={t.suit} value={t.value} scale={0.35} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Left opponent ─────────────────────────────────── */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center pl-2">
        {leftPlayer && (
          <OpponentHand
            name={leftPlayer.name}
            tileCount={leftPlayer.tileCount}
            isActive={gameState.currentTurn === leftSeat}
            position="left"
          />
        )}
      </div>

      {/* ── Right opponent ────────────────────────────────── */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center pr-2">
        {rightPlayer && (
          <OpponentHand
            name={rightPlayer.name}
            tileCount={rightPlayer.tileCount}
            isActive={gameState.currentTurn === rightSeat}
            position="right"
          />
        )}
      </div>

      {/* ── Center: discard pile + draw pile ─────────────── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: 140, paddingBottom: 20, paddingLeft: 130, paddingRight: 130 }}>
        <div className="flex flex-col items-center gap-4 w-full h-full">
          {/* Discard pile */}
          <div className="flex-1 w-full overflow-hidden">
            <DiscardPile
              tiles={gameState.discardPile}
              lastDiscardId={gameState.lastDiscard?.id}
            />
          </div>

          {/* Draw pile */}
          <DrawPile
            wallCount={gameState.wallCount}
            isMyTurn={isMyTurn && !hasDrawnThisTurn}
            onDraw={drawTile}
          />
        </div>
      </div>

      {/* ── My melds (above hand) ─────────────────────────── */}
      {myPlayer.melds.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1"
          style={{ bottom: bottomHandHeight }}
        >
          <MeldGroup melds={myPlayer.melds} scale={0.55} />
        </div>
      )}

      {/* ── My flower tiles ───────────────────────────────── */}
      {myPlayer.flowerTiles.length > 0 && (
        <div className="absolute right-4 flex gap-[2px]"
          style={{ bottom: bottomHandHeight + (myPlayer.melds.length > 0 ? 60 : 4) }}
        >
          {myPlayer.flowerTiles.map((t) => (
            <MahjongTile key={t.id} suit={t.suit} value={t.value} scale={0.4} />
          ))}
        </div>
      )}

      {/* ── My label ─────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ bottom: bottomHandHeight + 4 + (myPlayer.melds.length > 0 ? 56 : 0) }}
      >
        <PlayerLabel player={myPlayer} isActive={isMyTurn} />
      </div>

      {/* ── Action buttons ───────────────────────────────── */}
      <ActionButtons />

      {/* ── Bottom player hand ───────────────────────────── */}
      <PlayerHand
        hand={hasDrawnThisTurn ? myHand.slice(0, -1) : myHand}
        drawnTile={hasDrawnThisTurn ? myHand[myHand.length - 1] : null}
      />

      {/* ── Claim fly animation ──────────────────────────── */}
      {claimAnimation && (() => {
        const seats: Seat[] = ['east', 'south', 'west', 'north']
        const myIdx = seats.indexOf(myPlayer.seat)
        const claimIdx = seats.indexOf(claimAnimation.bySeat)
        const rel = (claimIdx - myIdx + 4) % 4
        const dirClass = rel === 0 ? 'claim-fly-bottom'
          : rel === 1 ? 'claim-fly-left'
          : rel === 2 ? 'claim-fly-top'
          : 'claim-fly-right'
        return (
          <div
            className={`${dirClass} fixed z-50 pointer-events-none`}
            style={{ top: '50%', left: '50%' }}
          >
            <MahjongTile suit={claimAnimation.tile.suit} value={claimAnimation.tile.value} />
          </div>
        )
      })()}
    </div>
  )
}

function PlayerLabel({
  player,
  isActive,
  vertical,
}: {
  player: Player
  isActive: boolean
  vertical?: boolean
}) {
  return (
    <div className={`flex items-center gap-1.5 ${vertical ? 'flex-col' : ''}`}>
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          isActive ? 'bg-white' : 'bg-white/20'
        }`}
      />
      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>
        {player.name}
      </span>
      <span className="text-white/20 text-[10px]">{player.score}</span>
    </div>
  )
}
