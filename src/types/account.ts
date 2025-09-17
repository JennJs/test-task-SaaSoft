import type { RecordType } from '@/enums/RecordType.ts'

export interface IAccount {
  id: string
  markString: string
  markArray: { text: string }[]
  recordType: RecordType
  login: string
  password: string | null
  isValid: boolean
}
