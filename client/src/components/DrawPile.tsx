interface DrawPileProps {
  wallCount: number
  isMyTurn: boolean
  onDraw: () => void
}

export default function DrawPile({ wallCount, isMyTurn, onDraw }: DrawPileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isMyTurn ? onDraw : undefined}
        disabled={!isMyTurn || wallCount === 0}
        className={[
          'w-[52px] h-[68px] rounded-[8px] border-2 flex items-center justify-center transition-all duration-100',
          isMyTurn && wallCount > 0
            ? 'border-white/40 bg-white/5 hover:bg-white/10 hover:border-white/70 cursor-pointer active:scale-95'
            : 'border-white/10 bg-white/[0.02] cursor-not-allowed opacity-40',
        ].join(' ')}
      >
        <svg width="28" height="36" viewBox="0 0 28 36">
          <rect x="1" y="1" width="26" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"/>
          <rect x="5" y="5" width="18" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/30"/>
        </svg>
      </button>
      <span className="text-white/30 text-[11px] font-medium tabular-nums">{wallCount}</span>
    </div>
  )
}
