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
import PointsBadge from './PointsBadge'

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

// Renders a tile at a fixed layout size
function SmallTile({ suit, value, scale = 0.4 }: { suit: Tile['suit']; value: Tile['value']; scale?: number }) {
  const w = Math.round(68 * scale)
  const h = Math.round(90 * scale)
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 68, height: 90 }}>
        <MahjongTile suit={suit} value={value} />
      </div>
    </div>
  )
}

const SEAT_WIND: Record<Seat, string> = {
  east: '東', south: '南', west: '西', north: '北',
}

export default function GameBoard() {
  const gameState = useGameStore((s) => s.gameState)
  const myHand = useGameStore((s) => s.myHand)
  const socketId = useGameStore((s) => s.socketId)
  const claimAnimation = useGameStore((s) => s.claimAnimation)
  const setClaimAnimation = useGameStore((s) => s.setClaimAnimation)
  const winningHandName = useGameStore((s) => s.winningHandName)
  const { drawTile } = useGameActions()

  useEffect(() => {
    if (!claimAnimation) return
    const t = setTimeout(() => setClaimAnimation(null), 700)
    return () => clearTimeout(t)
  }, [claimAnimation, setClaimAnimation])

  if (!gameState) return null

  const myPlayer = gameState.players.find((p) => p.id === socketId)
  if (!myPlayer) return null

  const isMyTurn = myPlayer.seat === gameState.currentTurn && gameState.phase === 'playing'
  const hasDrawnThisTurn = myHand.length % 3 === 2

  const seats: Seat[] = ['east', 'south', 'west', 'north']
  const myIdx = seats.indexOf(myPlayer.seat)
  const leftSeat  = seats[(myIdx + 1) % 4]
  const topSeat   = seats[(myIdx + 2) % 4]
  const rightSeat = seats[(myIdx + 3) % 4]

  const playerBySeat = (seat: Seat): Player | undefined =>
    gameState.players.find((p) => p.seat === seat)

  const leftPlayer  = playerBySeat(leftSeat)
  const topPlayer   = playerBySeat(topSeat)
  const rightPlayer = playerBySeat(rightSeat)

  const isFinished = gameState.phase === 'finished'
  const winnerPlayer = gameState.winner ? playerBySeat(gameState.winner) : null
  const isMe = gameState.winner === myPlayer.seat
  const orderedSeats: Seat[] = ['east', 'south', 'west', 'north']

  const handStripH = 90 + 28   // ~118px

  // Active-player glow
  const activeDir =
    gameState.currentTurn === topSeat    ? 'top'    :
    gameState.currentTurn === leftSeat   ? 'left'   :
    gameState.currentTurn === rightSeat  ? 'right'  :
    gameState.currentTurn === myPlayer.seat ? 'bottom' : null

  const glowGradient: Record<string, string> = {
    top:    'radial-gradient(ellipse 70% 30% at 50% 0%,   rgba(255,255,255,0.10) 0%, transparent 100%)',
    left:   'radial-gradient(ellipse 30% 70% at 0% 50%,   rgba(255,255,255,0.10) 0%, transparent 100%)',
    right:  'radial-gradient(ellipse 30% 70% at 100% 50%, rgba(255,255,255,0.10) 0%, transparent 100%)',
    bottom: 'radial-gradient(ellipse 70% 30% at 50% 100%, rgba(255,255,255,0.10) 0%, transparent 100%)',
  }

  // My extras strip (melds + flowers) height above hand
  const myMeldH   = myPlayer.melds.length > 0 ? Math.round(90 * 0.48) + 4 : 0
  const myFlowerH = myPlayer.flowerTiles.length > 0 && myPlayer.melds.length === 0 ? Math.round(90 * 0.38) + 4 : 0
  const myExtrasH = myMeldH || myFlowerH

  // How wide the side panels are (approx) — determines center area padding
  const SIDE_PANEL_W = 36   // OpponentHand rotation container width (ROW_H=28) + margin

  return (
    <div
      className="fixed inset-0 bg-[#111] overflow-hidden"
      style={{ paddingBottom: handStripH }}
    >
      {/* Active player glow */}
      {activeDir && (
        <div className="turn-glow absolute inset-0 z-0 pointer-events-none"
          style={{ background: glowGradient[activeDir] }}
        />
      )}

      {/* ── Points badge (top-right) ────────────────────────── */}
      <div className="absolute top-3 right-3 z-20">
        <PointsBadge />
      </div>

      {/* ── Top opponent ────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-2 z-10">
        {topPlayer && (
          <OpponentHand
            name={topPlayer.name}
            tileCount={topPlayer.tileCount}
            melds={topPlayer.melds}
            flowerTiles={topPlayer.flowerTiles}
            isActive={gameState.currentTurn === topSeat}
            position="top"
          />
        )}
      </div>

      {/* ── Left opponent ───────────────────────────────────── */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        {leftPlayer && (
          <OpponentHand
            name={leftPlayer.name}
            tileCount={leftPlayer.tileCount}
            melds={leftPlayer.melds}
            flowerTiles={leftPlayer.flowerTiles}
            isActive={gameState.currentTurn === leftSeat}
            position="left"
          />
        )}
      </div>

      {/* ── Right opponent ──────────────────────────────────── */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        {rightPlayer && (
          <OpponentHand
            name={rightPlayer.name}
            tileCount={rightPlayer.tileCount}
            melds={rightPlayer.melds}
            flowerTiles={rightPlayer.flowerTiles}
            isActive={gameState.currentTurn === rightSeat}
            position="right"
          />
        )}
      </div>

      {/* ── Center: discard pile + draw pile ─────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: 100, paddingBottom: 10, paddingLeft: SIDE_PANEL_W, paddingRight: SIDE_PANEL_W }}
      >
        <div className="flex flex-col items-center gap-3 w-full h-full">
          <div className="flex-1 w-full overflow-hidden">
            <DiscardPile
              tiles={gameState.discardPile}
              lastDiscardId={gameState.lastDiscard?.id}
            />
          </div>
          <DrawPile
            wallCount={gameState.wallCount}
            isMyTurn={isMyTurn && !hasDrawnThisTurn}
            onDraw={drawTile}
          />
        </div>
      </div>

      {/* ── My extras: melds + flowers above hand ──────────── */}
      {myExtrasH > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center gap-3 px-3"
          style={{ bottom: handStripH + 2 }}
        >
          {myPlayer.melds.length > 0 && (
            <MeldGroup melds={myPlayer.melds} scale={0.48} />
          )}
          {myPlayer.flowerTiles.length > 0 && (
            <div className="flex gap-[2px]" style={{ borderLeft: myPlayer.melds.length > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: myPlayer.melds.length > 0 ? 8 : 0 }}>
              {myPlayer.flowerTiles.map((t) => (
                <SmallTile key={t.id} suit={t.suit} value={t.value} scale={0.38} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Action buttons ───────────────────────────────── */}
      <ActionButtons bottomOffset={handStripH + myExtrasH + 34} />

      {/* ── My label ─────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ bottom: handStripH + myExtrasH + 6 }}
      >
        <PlayerLabel player={myPlayer} isActive={isMyTurn} />
      </div>

      {/* ── My hand ──────────────────────────────────────── */}
      <PlayerHand
        hand={hasDrawnThisTurn ? myHand.slice(0, -1) : myHand}
        drawnTile={hasDrawnThisTurn ? myHand[myHand.length - 1] : null}
      />

      {/* ── Claim fly animation ──────────────────────────── */}
      {claimAnimation && (() => {
        const myIdx2 = seats.indexOf(myPlayer.seat)
        const claimIdx = seats.indexOf(claimAnimation.bySeat)
        const rel = (claimIdx - myIdx2 + 4) % 4
        const dirClass = rel === 0 ? 'claim-fly-bottom'
          : rel === 1 ? 'claim-fly-left'
          : rel === 2 ? 'claim-fly-top'
          : 'claim-fly-right'
        return (
          <div className={`${dirClass} fixed z-50 pointer-events-none`} style={{ top: '50%', left: '50%' }}>
            <MahjongTile suit={claimAnimation.tile.suit} value={claimAnimation.tile.value} />
          </div>
        )
      })()}

      {/* ── Win overlay ──────────────────────────────────── */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.55)' }}
        >
          <div className="w-full max-w-sm mx-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div className="text-center">
              <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                {gameState.winner ? (isMe ? 'You win!' : `${winnerPlayer?.name ?? 'Someone'} wins`) : 'Draw'}
              </div>
              <div className="text-white text-5xl font-bold mb-1">
                {gameState.winner ? (isMe ? '🀄' : SEAT_WIND[gameState.winner]) : '—'}
              </div>
              {winningHandName && (
                <div className="text-white/60 text-sm font-medium tracking-wide">{winningHandName}</div>
              )}
            </div>

            {/* Player hands */}
            <div className="flex flex-col gap-2">
              {orderedSeats.map((seat) => {
                const p = playerBySeat(seat)
                if (!p) return null
                const isWinner = seat === gameState.winner
                const showHand = p.id === myPlayer.id ? myHand : p.hand
                return (
                  <div key={seat}
                    className={`rounded-xl p-2.5 border ${isWinner ? 'border-white/25 bg-white/[0.06]' : 'border-white/[0.05] bg-white/[0.02]'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`text-xs font-semibold ${isWinner ? 'text-white' : 'text-white/40'}`}>{p.name}</span>
                      <span className="text-white/20 text-[10px]">{SEAT_WIND[seat]}</span>
                      {isWinner && <span className="text-white/35 text-[9px] uppercase tracking-widest ml-auto">winner</span>}
                    </div>
                    <div className="flex flex-wrap gap-[2px]">
                      {sortTiles(showHand).map((tile) => (
                        <SmallTile key={tile.id} suit={tile.suit} value={tile.value} scale={0.42} />
                      ))}
                      {p.melds.map((meld, i) => (
                        <div key={`meld-${i}`} className="flex gap-[1px] ml-1.5 border-l border-white/10 pl-1.5">
                          {meld.tiles.map((tile, j) => (
                            <SmallTile key={j} suit={tile.suit} value={tile.value} scale={0.42} />
                          ))}
                        </div>
                      ))}
                    </div>
                    {p.flowerTiles.length > 0 && (
                      <div className="flex flex-wrap gap-[2px] mt-1.5 pt-1.5 border-t border-white/5">
                        {p.flowerTiles.map((tile) => (
                          <SmallTile key={tile.id} suit={tile.suit} value={tile.value} scale={0.35} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerLabel({ player, isActive }: { player: Player; isActive: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-white' : 'bg-white/20'}`} />
      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>{player.name}</span>
      <span className="text-white/20 text-[10px]">{player.score}</span>
    </div>
  )
}
