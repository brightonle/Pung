import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import type { Player, Seat } from '../types'
import OpponentHand from './OpponentHand'
import DiscardPile from './DiscardPile'
import DrawPile from './DrawPile'
import PlayerHand from './PlayerHand'
import ActionButtons from './ActionButtons'
import MeldGroup from './MeldGroup'

const SEAT_WIND: Record<Seat, string> = {
  east: '東',
  south: '南',
  west: '西',
  north: '北',
}

export default function GameBoard() {
  const gameState = useGameStore((s) => s.gameState)
  const myHand = useGameStore((s) => s.myHand)
  const drawnTile = useGameStore((s) => s.drawnTile)
  const socketId = useGameStore((s) => s.socketId)
  const { drawTile } = useGameActions()

  if (!gameState) return null

  const myPlayer = gameState.players.find((p) => p.id === socketId)
  if (!myPlayer) return null

  const isMyTurn = myPlayer.seat === gameState.currentTurn && gameState.phase === 'playing'
  const hasDrawnThisTurn = myHand.length === 14

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

  // Win overlay
  if (gameState.phase === 'finished' && gameState.winner) {
    const winnerPlayer = playerBySeat(gameState.winner)
    const isMe = gameState.winner === myPlayer.seat
    return (
      <div className="fixed inset-0 bg-[#111] flex items-center justify-center z-50">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="text-white/30 text-sm uppercase tracking-widest">
            {isMe ? 'You win!' : `${winnerPlayer?.name ?? 'Someone'} wins`}
          </div>
          <div className="text-white text-6xl font-bold">
            {isMe ? '🀄' : SEAT_WIND[gameState.winner]}
          </div>
          <div className="text-white/40 text-sm">
            {isMe ? 'Congratulations' : `${winnerPlayer?.name} won this round`}
          </div>
        </div>
      </div>
    )
  }

  const bottomHandHeight = Math.round(90) + 28
  const boardBottom = bottomHandHeight

  return (
    <div
      className="fixed inset-0 bg-[#111] overflow-hidden"
      style={{ paddingBottom: boardBottom }}
    >
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
          {/* Round info */}
          <div className="flex items-center gap-3">
            <span className="text-white/20 text-xs uppercase tracking-widest">
              Round {gameState.roundNumber}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/20 text-xs">{SEAT_WIND[gameState.roundWind]} wind</span>
          </div>

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
        hand={myHand.slice(0, 13)}
        drawnTile={myHand.length === 14 ? myHand[13] : drawnTile}
      />
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
