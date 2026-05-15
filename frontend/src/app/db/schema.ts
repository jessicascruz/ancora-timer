// frontend/src/db/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'sessions',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'duration_minutes', type: 'number' },
        { name: 'break_minutes', type: 'number' },
        { name: 'started_at', type: 'number' },       // timestamp
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'status', type: 'string' },            // 'running' | 'paused' | 'done'
        { name: 'synced', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'session_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'doing_now', type: 'string', isOptional: true },
        { name: 'next_step', type: 'string', isOptional: true },
        { name: 'open_thought', type: 'string', isOptional: true },
        { name: 'audio_url', type: 'string', isOptional: true },
        { name: 'ai_summary', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synced', type: 'boolean' },
      ],
    }),
  ],
})