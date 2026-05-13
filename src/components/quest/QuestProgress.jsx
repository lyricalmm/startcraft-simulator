export default function QuestProgress({ current, total, missionTitle }) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="flex items-center gap-4 rounded-full border border-slate-800 bg-slate-900/55 px-4 py-3">
      <span className="whitespace-nowrap text-xs font-medium tabular-nums text-slate-400">
        {current} / {total}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {missionTitle && (
        <span className="hidden whitespace-nowrap text-xs font-medium text-slate-500 sm:block">
          {missionTitle}
        </span>
      )}
    </div>
  )
}
