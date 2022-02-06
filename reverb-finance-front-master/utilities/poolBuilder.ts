import { Pool, Deal } from '~/types'
import { randomId, sample, randomBetween, round } from '~/utilities/utils'

class PoolBuilder {

  build (amount: number, hasInvested: boolean): Pool[] {
    return Array.from(Array(amount).keys()).map(_ => this.buildPool(hasInvested))
  }

  buildPool(hasInvested: boolean): Pool {
    const deals = this.buildDeals(round(randomBetween(7,15), 0))
    const totalLpBalance = randomBetween(100, 1000)
    const userLpBalance = hasInvested ? randomBetween(totalLpBalance * 0.2, totalLpBalance * 0.9) : 0
    const dealBalance = deals.reduce ((sum, deal) => sum + deal.amount, 0)
    const totalBalance = randomBetween(dealBalance, dealBalance * 10)
    const unallocatedBalance = totalBalance - dealBalance
    const dealsApr = round(deals.reduce((sum, deal) => sum + deal.amount * deal.apr ,0) / dealBalance, 4)
    const unallocatedApr = randomBetween(0.04, 0.06)
    const apr = round((dealsApr * dealBalance + unallocatedApr * unallocatedBalance) / totalBalance, 4)

    return {
      address: randomId(10),
      name: sample(poolNames),
      totalLpBalance,
      userLpBalance,
      totalBalance,
      dealBalance,
      unallocatedBalance,
      dealsApr,
      unallocatedApr,
      apr,
      currency: 'USDC',
      riskClass: sample(['A', 'B', 'C']),
      deals: this.buildDeals(randomBetween(6,12, 0))
    }
  }

  buildDeals(amount: number): Deal[] {
    return Array.from(Array(amount).keys()).map(_ => {
      return {
        id: randomId(10),
        customer: sample(businessNames),
        amount: randomBetween(50, 400),
        apr: randomBetween(0.06, 0.012, 4),
        currency: 'USDC'
      }
    })
  }
}

const poolNames = [
  'B2B NoCode Saas',
  'Green Tech',
  'Wellness',
  'Apple Care',
  'Detail Saas',
  'Flow Saas',
  'Saasgenics',
  'Aura Saas',
  'Flash Saas',
  'Superb Saas',
  'Saasjet',
  'Medium Saas',
  'Saasio',
  'Saasquipo',
  'Unforgettable Saas',
  'Butterfly Saas',
  'Serf Saas',
  'Flag Saas',
  'Saasegy',
  'Share Saas',
  'Wink Saas',
  'Omega Saas',
  'Opponent Saas',
  'Measure Saas',
  'Smoke Saas',
  'Clash Saas',
  'Paddle Saas',
  'Eternal Saas'
]

const businessNames = [
  'Marshal Saas',
  'Farmstead Saas',
  'Atomic Saas',
  'Jupiter Saas',
  'Saaswind',
  'Sinful Saas',
  'Saaslada',
  'Advance Saas',
  'Speed Saas',
  'Push Saas',
  'Bobble Saas',
  'Air Saas',
  'Kisan Saas',
  'Swarm Saas',
  'Vibe Saas',
  'Landscape Saas',
  'Ultra Saas',
  'Loan Saas',
  'Vanguard Saas',
  'Bytes Saas',
  'Saaszilla',
  'Compass Saas',
  'Saassio',
  'Zap Saas',
  'Change Saas',
  'Saasscape',
  'Navigator Saas',
  'Joker Saas',
  'Atlas Saas',
  'Express Saas',
  'Reinvent Saas',
  'Orchids Saas',
  'Saasporium',
  'Thrive Saas',
  'Quest Saas',
  'Dreamboat Saas',
  'Revolution Saas',
  'Mist Saas',
  'Satya Saas',
  'Heaven Saas',
  'Capture Saas',
  'Saascog',
  'Knight Saas',
  'Chorus Saas',
  'Saaszen',
  'Direct Saas',
  'Max Saas',
  'Venom Saas',
  'Foster Saas',
  'Yum Saas',
  'Celestial Saas',
  'Patch Saas',
  'Loyal Saas',
  'Indo Saas',
  'Palace Saas',
  'Saasopedia',
  'Connect Saas',
  'Magnetic Saas',
  'Smash Saas',
  'Madonna Saas',
  'Tech Saas',
  'Fix Saas',
  'Saasbea',
  'Aviator Saas',
  'Saasdo',
  'Vitality Saas',
  'Saasaholic',
  'Bare Saas',
  'Saasadil',
  'Saasooze',
  'Artistry Saas',
  'Saashut',
  'Click to Save',
]

export const poolBuilder = new PoolBuilder()
