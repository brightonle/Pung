import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import type { ClaimType } from '../types'

const CLAIM_TIMEOUT_MS = 5000

export default function ActionButtons() {
  const gameState = useGameStore((s) => s.gameState)
  const socketId = useGameStore((s) => s.socketId)
  const myHand = useGameStore((s) => s.myHand)
  const [timeLeft, setTimeLeft] = useState(CLAIM_TIMEOUT_MS)
  const { sendClaim, passClaim, drawTile } = useGameActions()

  const myPlayer = gameState?.players.find((p) => p.id === socketId)
  const isMyTurn = myPlayer?.seat === gameState?.currentTurn
  const isClaiming = gameState?.phase === 'claiming'
  const isPlaying = gameState?.phase === 'playing'
  const lastDiscard = gameState?.lastDiscard
  const lastDiscardBy = gameState?.lastDiscardBy
  const isMyDiscard = myPlayer?.seat === lastDiscardBy

  // Reset & tick countdown when claim window opens
  useEffect(() => {
    if (!isClaiming) { setTimeLeft(CLAIM_TIMEOUT_MS); return }
    setTimeLeft(CLAIM_TIMEOUT_MS)
    const start = Date.now()
    const id = setInterval(() => {
      const remaining = CLAIM_TIMEOUT_MS - (Date.now() - start)
      setTimeLeft(Math.max(0, remaining))
      if (remaining <= 0) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [isClaiming, lastDiscard?.id])

  // What claims can I make on the current discard?
  function canPong() {
    if (!lastDiscard || isMyDiscard) return false
    const matches = myHand.filter(
      (t) => t.suit === lastDiscard.suit && t.value === lastDiscard.value
    )
    return matches.length >= 2
  }

  function canChow() {
    if (!lastDiscard || isMyDiscard) return false
    // Only the next player in turn order can chow
    const seats: string[] = ['east', 'south', 'west', 'north']
    const discardIdx = seats.indexOf(lastDiscardBy ?? '')
    const nextSeat = seats[(discardIdx + 1) % 4]
    if (myPlayer?.seat !== nextSeat) return false
    if (!['dots', 'bamboo', 'characters'].includes(lastDiscard.suit)) return false
    const v = Number(lastDiscard.value)
    const suitTiles = myHand.filter((t) => t.suit === lastDiscard.suit).map((t) => Number(t.value))
    // Can form a sequence including v
    return (
      (suitTiles.includes(v - 2) && suitTiles.includes(v - 1)) ||
      (suitTiles.includes(v - 1) && suitTiles.includes(v + 1)) ||
      (suitTiles.includes(v + 1) && suitTiles.includes(v + 2))
    )
  }

  function canKong() {
    if (!lastDiscard || isMyDiscard) return false
    const matches = myHand.filter(
      (t) => t.suit === lastDiscard.suit && t.value === lastDiscard.value
    )
    return matches.length >= 3
  }

  function canWin() {
    return true // server is authoritative; button always shows, server validates
  }

  if (!gameState || !myPlayer) return null

  // Show draw button during my turn in playing phase (before drawing)
  const showDraw = isPlaying && isMyTurn && myHand.length === 13

  // Show claim buttons during claiming phase (for non-discarder)
  const showClaim = isClaiming && !isMyDiscard

  if (!showDraw && !showClaim) return null

  return (
    <div className="fixed left-0 right-0 flex flex-col items-center gap-2 z-20"
      style={{ bottom: `${Math.round(90) + 32}px` }}
    >
      {/* Countdown bar */}
      {showClaim && (
        <div className="w-64 h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-none"
            style={{ width: `${(timeLeft / CLAIM_TIMEOUT_MS) * 100}%` }}
          />
        </div>
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        {showClaim && canWin() && (
          <ActionBtn label="Win" accent onClick={() => sendClaim('win')} />
        )}
        {showClaim && canKong() && (
          <ActionBtn label="Kong" onClick={() => sendClaim('kong')} />
        )}
        {showClaim && canPong() && (
          <ActionBtn label="Pong" onClick={() => sendClaim('pong')} />
        )}
        {showClaim && canChow() && (
          <ActionBtn label="Chow" onClick={() => sendClaim('chow')} />
        )}
        {showClaim && (
          <ActionBtn label="Pass" muted onClick={passClaim} />
        )}
        {showDraw && (
          <ActionBtn label="Draw" onClick={drawTile} />
        )}
      </div>
    </div>
  )
}

function ActionBtn({
  label,
  onClick,
  accent,
  muted,
}: {
  label: string
  onClick: () => void
  accent?: boolean
  muted?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-100 active:scale-95',
        accent
          ? 'bg-white text-black border-white hover:bg-white/90'
          : muted
          ? 'bg-transparent text-white/40 border-white/10 hover:bg-white/5 hover:text-white/60'
          : 'bg-[#222] text-white border-white/10 hover:bg-[#333]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
