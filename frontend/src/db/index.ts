import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { schema } from './schema'
import Session from './models/Session'
import Note from './models/Note'

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
})

const database = new Database({
  adapter,
  modelClasses: [Session, Note],
})

export default database
export { Session, Note }
