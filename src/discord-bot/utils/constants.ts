import { BranchType } from '@prisma/client'

export const branchAbbreviations: Record<BranchType, string> = {
  CONTENT: 'CT',
  DESIGN: 'DS',
  MARKETING: 'MK',
  PROGRAMMING: 'PG',
}
