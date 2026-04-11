import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export type IconChoice = 'red-dragon' | 'green-dragon' | 'blue-dragon' | 'sparrow'

const ICONS: { id: IconChoice; label: string; offsetX: number }[] = [
  { id: 'red-dragon',   label: 'Red Dragon',   offsetX: -5 },
  { id: 'green-dragon', label: 'Green Dragon', offsetX: -95 },
  { id: 'blue-dragon',  label: 'Blue Dragon',  offsetX: -185 },
  { id: 'sparrow',      label: 'Sparrow',      offsetX: -265 },
]

export function MahjongIcon({ icon, size = 72 }: { icon: IconChoice; size?: number }) {
  const entry = ICONS.find((i) => i.id === icon)!
  // SVG rendered at width=340 (680*0.5), height=145 (290*0.5)
  // Each icon circle center-y at 140*0.5=70, so top offset = 70 - size/2
  const scale = size / 80
  const imgW = 340 * scale
  const imgH = 145 * scale
  const offsetX = entry.offsetX * scale
  const offsetY = -(70 * scale - size / 2)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <img
        src="/mahjong_icons.svg"
        alt={entry.label}
        style={{
          position: 'absolute',
          width: imgW,
          height: imgH,
          left: offsetX,
          top: offsetY,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function AccountSetup() {
  const [username, setUsername] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IconChoice | null>(null)
  const setUserProfile = useGameStore((s) => s.setUserProfile)

  function handleCreate() {
    const name = username.trim()
    if (!name || !selectedIcon) return
    const profile = { username: name, icon: selectedIcon, points: 500 }
    localStorage.setItem('pung_profile', JSON.stringify(profile))
    setUserProfile(profile)
  }

  const canCreate = username.trim().length > 0 && selectedIcon !== null

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-white text-5xl font-bold tracking-tight">Pung</h1>
          <p className="text-white/30 text-sm mt-2">Create your account</p>
        </div>

        {/* Icon picker */}
        <div className="flex flex-col gap-3">
          <p className="text-white/50 text-xs uppercase tracking-widest">Choose your icon</p>
          <div className="grid grid-cols-4 gap-3">
            {ICONS.map((icon) => {
              const isSelected = selectedIcon === icon.id
              return (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={[
                    'flex flex-col items-center gap-2 py-3 rounded-xl border transition-all duration-100',
                    isSelected
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07]',
                  ].join(' ')}
                >
                  <MahjongIcon icon={icon.id} size={56} />
                  <span className="text-[9px] text-white/40 leading-none">{icon.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-3">
          <p className="text-white/50 text-xs uppercase tracking-widest">Username</p>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canCreate && handleCreate()}
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25
              text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={[
            'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-100',
            canCreate
              ? 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
              : 'bg-white/8 text-white/30 cursor-not-allowed',
          ].join(' ')}
        >
          Create Account
        </button>

        <p className="text-white/20 text-xs text-center -mt-4">
          You'll start with 500 points
        </p>
      </div>
    </div>
  )
}
