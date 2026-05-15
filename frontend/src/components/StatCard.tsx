'use client'

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: number
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>

      {trend !== undefined && (
        <div className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  )
}
