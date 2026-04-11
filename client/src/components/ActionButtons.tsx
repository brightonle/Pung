import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import { getWinResult } from '../utils/winDetection'

const CLAIM_TIMEOUT_MS = 15000

export default function ActionButtons() {
  const gameState = useGameStore((s) => s.gameState)
  const socketId = useGameStore((s) => s.socketId)
  const myHand = useGameStore((s) => s.myHand)
  const [timeLeft, setTimeLeft] = useState(CLAIM_TIMEOUT_MS)
  const { sendClaim, passClaim, drawTile, declareWin } = useGameActions()

  const myPlayer = gameState?.players.find((p) => p.id === socketId)
  const isMyTurn = myPlayer?.seat === gameState?.currentTurn
  const isClaiming = gameState?.phase === 'claiming'
  const isPlaying = gameState?.phase === 'playing'
  const lastDiscard = gameState?.lastDiscard
  const lastDiscardBy = gameState?.lastDiscardBy
  const isMyDiscard = myPlayer?.seat === lastDiscardBy

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

  // ── Claim checks ────────────────────────────────────────────────────────────

  function checkCanPong() {
    if (!lastDiscard || isMyDiscard) return false
    return myHand.filter(t => t.suit === lastDiscard.suit && t.value === lastDiscard.value).length >= 2
  }

  function checkCanGong() {
    if (!lastDiscard || isMyDiscard) return false
    return myHand.filter(t => t.suit === lastDiscard.suit && t.value === lastDiscard.value).length >= 3
  }

  function checkCanWin() {
    if (!lastDiscard || isMyDiscard) return false
    return getWinResult(myHand, myPlayer?.melds ?? [], lastDiscard) !== null
  }

  // Self-draw win: drawn tile is the last tile when hand % 3 === 2
  const selfDrawWinResult = useMemo(() => {
    if (!isPlaying || !isMyTurn || myHand.length % 3 !== 2) return null
    const drawnTile = myHand[myHand.length - 1]
    const handWithoutDraw = myHand.slice(0, -1)
    return getWinResult(handWithoutDraw, myPlayer?.melds ?? [], drawnTile)
  }, [isPlaying, isMyTurn, myHand, myPlayer?.melds])

  // Returns the two hand tile IDs needed to form a chi with lastDiscard, or null if not possible.
  // Chi is only available to the player immediately left of the discarder.
  function getChiTileIds(): [string, string] | null {
    if (!lastDiscard || isMyDiscard) return null
    const seats = ['east', 'south', 'west', 'north']
    const nextSeat = seats[(seats.indexOf(lastDiscardBy ?? '') + 1) % 4]
    if (myPlayer?.seat !== nextSeat) return null
    if (!['dots', 'bamboo', 'characters'].includes(lastDiscard.suit)) return null

    const v = Number(lastDiscard.value)
    const st = myHand.filter(t => t.suit === lastDiscard!.suit)
    const find = (val: number) => st.find(t => Number(t.value) === val)

    const tm2 = find(v - 2), tm1 = find(v - 1)
    const tp1 = find(v + 1), tp2 = find(v + 2)

    if (tm2 && tm1) return [tm2.id, tm1.id]
    if (tm1 && tp1) return [tm1.id, tp1.id]
    if (tp1 && tp2) return [tp1.id, tp2.id]
    return null
  }

  if (!gameState || !myPlayer) return null

  const showDraw = isPlaying && isMyTurn && myHand.length % 3 === 1
  const showSelfDrawWin = isPlaying && isMyTurn && selfDrawWinResult !== null
  const showClaim = isClaiming && !isMyDiscard
  if (!showDraw && !showClaim && !showSelfDrawWin) return null

  const chiTileIds = showClaim ? getChiTileIds() : null
  const meldCount = myPlayer.melds.length
  // hand strip (~118) + meld/flower row when present (~52) + gap
  const bottomPx = 118 + (meldCount > 0 ? 52 : 0) + 24

  return (
    <div className="fixed left-0 right-0 flex flex-col items-center gap-2 z-20"
      style={{ bottom: bottomPx }}
    >
      {showClaim && (
        <div className="w-64 h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-none"
            style={{ width: `${(timeLeft / CLAIM_TIMEOUT_MS) * 100}%` }}
          />
        </div>
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        {showSelfDrawWin && (
          <ActionBtn label="Win" accent onClick={declareWin} />
        )}
        {showClaim && checkCanWin() && (
          <ActionBtn label="Win" accent onClick={() => sendClaim('win')} />
        )}
        {showClaim && checkCanGong() && (
          <ActionBtn label="Gong" onClick={() => sendClaim('kong')} />
        )}
        {showClaim && checkCanPong() && (
          <ActionBtn label="Pong" onClick={() => sendClaim('pong')} />
        )}
        {showClaim && chiTileIds && (
          <ActionBtn label="Chi" onClick={() => sendClaim('chow', chiTileIds)} />
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

function ActionBtn({ label, onClick, accent, muted }: {
  label: string; onClick: () => void; accent?: boolean; muted?: boolean
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
