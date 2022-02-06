<template>
  <NooniModal @close="$emit('close')">
    <div class="p-8">
      <h2 class="text-xl font-bold mb-4">{{ pool.name }}</h2>
      <div class="flex items-center justify-between rounded-lg bg-gray-100 drop-shadow-md py-8 px-16 w-[1200px]">
        <div class="flex items-center w-4/6 grow">
          <div class="mr-8">
            <p class="mb-8"><span class="font-bold text-xl">{{ formatCurrency(pool.totalBalance, "") }}</span> {{ pool.currency }} TVL</p>
            <p><span class="font-bold text-xl">{{ formatPercent(pool.apr) }}</span><br>APR</p>
          </div>
          <div>
            <CounterChart
              class="h-40 w-40"
              :data="[pool.dealBalance, pool.unallocatedBalance]"></CounterChart>
          </div>
          <div class="ml-8 flex flex-col justify-between grow">
            <div class="mb-8 flex w-full justify-between">
              <div class="w-2/6">
                <p class="text-emerald-400"><span class="font-bold text-xl">{{ formatCurrency(pool.dealBalance) }}</span> {{ pool.currency }}</p>
                <p>in deals</p>
              </div>
              <div class="ml-8 w-2/6">
                <p class="text-emerald-400"><span class="font-bold text-xl">{{ formatPercent(pool.dealsApr) }}</span></p>
                <p>APR</p>
              </div>
              <div class="w-2/6">
                <p class="text-emerald-400"><span class="font-bold text-xl">{{ pool.deals.length }}</span></p>
                <p>deals</p>
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div class="w-2/6">
                <p class="text-purple-700"><span class="font-bold text-xl">{{ formatCurrency(pool.unallocatedBalance) }}</span> {{ pool.currency }}</p>
                <p>unallocated <br> (in DeFi)</p>
              </div>
              <div class="ml-8 w-2/6">
                <p class="text-purple-700"><span class="font-bold text-xl">{{ formatPercent(pool.unallocatedApr) }}</span></p>
                <p>APR</p>
              </div>
              <div class="w-2/6">
                <p><span class="font-bold text-xl">{{ pool.riskClass }}</span></p>
                <p>risk class</p>
              </div>
            </div>
          </div>
          <div class="ml-8 p-4 rounded-lg bg-emerald-400 text-white drop-shadow-lg">
            <p><span class="font-bold text-xl">{{ formatCurrency(userBalance) }}</span> {{ pool.currency }}</p>
            <p>my current balance</p>
          </div>
        </div>
      </div>

      <h2 class="text-xl font-bold mt-8 mb-4">Deals</h2>
      <DealsTable :items="deals"/>

      <div v-if="walletAddress" class="mt-16 w-full flex items-center justify-center">
        <button class="w-32 rounded p-4 border border-emerald-400 text-emerald-400 bg-white font-bold drop-shadow-lg transition-all hover:scale-105" @click="openModal('withdraw')" >Withdraw</button>
        <button class="ml-8 w-32 rounded p-4 border border-white text-white bg-emerald-400 font-bold drop-shadow-lg transition-all hover:scale-105" @click="openModal('deposit')" >Deposit</button>
      </div>
    </div>
    <DepositWithdrawModal v-if="depositWithdrawModalOpen" :default-action="modalAction" :pool="pool" @close="depositWithdrawModalOpen = false"/>
  </NooniModal>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { mapState } from 'vuex'
import { filters } from '~/utilities/filters'
import { round } from '~/utilities/utils'
import { Pool } from '~/types'
import CounterChart from '~/components/ui/charts/CounterChart.vue'
import NooniModal from '~/components/ui/NooniModal.vue'
import DealsTable from '~/components/domain/deals/DealsTable.vue'
import DepositWithdrawModal from '~/components/domain/pools/DepositWithdrawModal.vue'

export default defineComponent({

  components: {
    CounterChart,
    NooniModal,
    DealsTable,
    DepositWithdrawModal
  },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true
    }
  },

  data () {
    return {
      depositWithdrawModalOpen: false,
      modalAction: null
    }
  },

  computed: {
    ...mapState({
      walletAddress: 'walletAddress'
    }),

    deals () {
      return this.pool.deals.map(deal => {
        return {
          ...deal,
          pool: {
            name: this.pool.name
          }
        }
      })
    },

    userBalance () {
      return round(this.pool.userLpBalance / this.pool.totalLpBalance * this.pool.totalBalance, 2)
    }
  },

  methods: {
    formatCurrency: filters.currency,
    formatPercent: filters.percent,

    openModal(action) {
      this.modalAction = action
      this.depositWithdrawModalOpen = true
    }
  },

})
</script>
