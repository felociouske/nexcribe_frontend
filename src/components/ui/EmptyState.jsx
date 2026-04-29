export default function EmptyState({ icon = '◻', title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-4xl mb-4 opacity-40">{icon}</span>
      <p className="font-display font-700 text-navy-700 text-lg">{title}</p>
      {desc && <p className="text-navy-500 text-sm mt-1 max-w-xs">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
