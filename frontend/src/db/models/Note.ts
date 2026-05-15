import { Model } from '@nozbe/watermelondb'
import { field, date, relation } from '@nozbe/watermelondb/decorators'
import Session from './Session'

export default class Note extends Model {
  static table = 'notes'
  static associations = {
    sessions: { type: 'belongs_to' as const, key: 'session_id' },
  }

  @field('session_id')   sessionId!: string
  @field('server_id')    serverId!: string | null
  @field('doing_now')    doingNow!: string | null
  @field('next_step')    nextStep!: string | null
  @field('open_thought') openThought!: string | null
  @field('audio_url')    audioUrl!: string | null
  @field('ai_summary')   aiSummary!: string | null
  @date('created_at') createdAt!: Date
  @field('synced') synced!: boolean
  @field('updated_at') updatedAt!: Date

  @relation('sessions', 'session_id') session!: Session
}
