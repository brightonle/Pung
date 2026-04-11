import { useGameStore } from '../store/gameStore'
import { MahjongIcon } from './AccountSetup'

export default function PointsBadge() {
  const profile = useGameStore((s) => s.userProfile)
  if (!profile) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
      <MahjongIcon icon={profile.icon} size={24} />
      <span className="text-white/80 text-xs font-medium">{profile.username}</span>
      <span className="text-white/30 text-xs">·</span>
      <span className="text-white text-xs font-semibold">{profile.points.toLocaleString()}</span>
      <span className="text-white/30 text-[10px]">pts</span>
    </div>
  )
}
