import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CurrentPosition, Pool } from '~/types'
import { _fetchPool, _deposit, _withdraw, _approveUsdc, _approveLp } from '~/utilities/fetch-data.js'
import { round, randomBetween, getSigner } from '~/utilities/utils'
import { poolBuilder } from '~/utilities/poolBuilder'

declare global {
  const $nuxt: any
}

const investedPools: Pool[] = []

export const state = (): {
  walletAddress: string | null,
  currentPosition: CurrentPosition | null,
  investedPools: Pool[],
  pools: Pool[],
} => ({
  walletAddress: null,
  currentPosition: null,
  investedPools,
  pools: [...investedPools, ...poolBuilder.build(8, false)]
})


export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  deals(state) {
    return state.pools?.map(pool => (pool.deals || []).map(deal => ({ ...deal, pool: { name: pool.name } }))).flat(1)
  }
}

export const mutations: MutationTree<RootState> = {
  setCurrentPosition: (state) => {
    const userBalance = round(state.investedPools.reduce((sum, pool) => sum + pool.userLpBalance / pool.totalLpBalance * pool.totalBalance, 0), 2)
    const totalPoolsBalance = state.investedPools.reduce((sum, pool) => sum + pool.totalBalance, 0)
    const userDealBalance = round(state.investedPools.reduce((sum, pool) => sum + pool.userLpBalance / pool.totalLpBalance * pool.dealBalance, 0), 2)
    const userUnallocatedBalance = round(state.investedPools.reduce((sum, pool) => sum + pool.userLpBalance / pool.totalLpBalance * pool.unallocatedBalance, 0), 2)
    state.currentPosition = {
      totalBalance: userBalance,
      dealBalance: userDealBalance,
      unallocatedBalance: userUnallocatedBalance,
      earnings: round(randomBetween(0.005, 0.015) * userBalance, 2),
      apr: round(state.investedPools.reduce((sum, pool) => sum + pool.totalBalance * pool.apr, 0) / totalPoolsBalance, 4),
      poolCount: state.investedPools.length,
      activeDealCount: state.investedPools.reduce((sum, pool) => sum + pool.deals.length, 0),
      currency: "USDC"
    }
  },
  setWalletAddress: (state, address: string) => (state.walletAddress = address),
  addOrUpdatePool: (state, pool: Pool) => {
    const index = state.pools.findIndex(p => p.address === pool.address)
    if (index >= 0) {
      state.pools.splice(index, 1, pool)
    } else {
      state.pools = [pool, ...state.pools]
    }
    state.investedPools = state.pools.filter(pool => pool.userLpBalance > 0)
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async connectWallet({ state, commit, dispatch }) {
    if (!state.walletAddress) {
      try {
        const signer = await getSigner()
        commit('setWalletAddress', await signer.getAddress())
        await dispatch('fetchPool') // DEMO HACK - Fetching the REAL pool from the blockchain
        commit('setCurrentPosition')
      } catch (e) {
        console.error(e)
        alert('error while connecting to metamask')
      }
    }
  },

  async deposit({ dispatch }, { amount }: { amount: number }) {
    if (!amount) return
    await deposit({ amount })
    dispatch('fetchPool')
  },

  async withdraw({ dispatch }, { lpAmount }: { lpAmount: number }) {
    if (!lpAmount) return
    await withdraw({ lpAmount })
    dispatch('fetchPool')
  },

  async fetchPool({ state, commit }) {
    if (!state.walletAddress) return
    const fetchedPool = await fetchPool() as Pool
    if (fetchedPool) commit('addOrUpdatePool', fetchedPool)
    $nuxt.$emit('poolFetched')
  }
}



const withdraw = async ({ lpAmount }: { lpAmount: number }) => {
  try {
    const signer = await getSigner()
    await _approveLp(lpAmount, signer);
    await _withdraw(lpAmount, signer);
  } catch (e) {
    console.error(e)
    alert('The was an error while withdrawing')
  }
}

const deposit = async ({ amount }: { amount: number }) => {
  try {
    const signer = await getSigner()
    await _approveUsdc(amount, signer);
    await _deposit(amount, signer);
  } catch (e) {
    console.error(e)
    alert('The was an error while depositing')
  }
}

const fetchPool = async () => {
  const signer = await getSigner()
  const fetchedPool = await _fetchPool(signer);
  console.log(fetchedPool)
  return fetchedPool; // TODO: GET POOL DATA FROM CONTRACT
}


