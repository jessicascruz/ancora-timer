import { Model } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'

export default class Session extends Model {
  static table = 'sessions'
  static associations = {
    notes: { type: 'has_many' as const, foreignKey: 'session_id' },
  }

  @field('server_id') serverId!: string | null
  @field('duration_minutes') durationMinutes!: number
  @field('break_minutes') breakMinutes!: number
  @field('status') status!: string
  @date('started_at') startedAt!: Date
  @date('completed_at') completedAt!: Date | null
  @field('synced') synced!: boolean
  @field('updated_at') updatedAt!: Date

  @children('notes') notes!: any
}
