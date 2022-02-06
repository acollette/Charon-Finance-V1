export type CurrentPosition = {
  totalBalance: number,
  dealBalance: number,
  unallocatedBalance: number,
  earnings: number,
  poolCount: number,
  apr: number,
  activeDealCount: number,
  currency: 'USDC'
}

export type Deal = {
  id: string,
  customer: string,
  amount: number,
  apr: number,
  currency: 'USDC',
  pool?: {
    name: string
  }
}

export type Pool = {
  address: string,
  name: string,
  userLpBalance: number,
  totalLpBalance: number,
  totalBalance: number,
  dealBalance: number,
  unallocatedBalance: number,
  apr: number,
  dealsApr: number,
  unallocatedApr: number,
  currency: 'USDC',
  riskClass: 'A' | 'B' | 'C',
  deals: Deal[]
}

export type BlogPost = {
  title: string,
  url: string,
  text: string
}
