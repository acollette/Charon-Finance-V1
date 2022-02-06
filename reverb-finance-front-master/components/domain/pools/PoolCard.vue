<template>
  <div :class="invested ? 'bg-emerald-200' : 'bg-gray-100'" class="rounded-lg drop-shadow-md px-4 py-8 text-center flex flex-col gap-6">
    <h2 class="text-xl">{{ pool.name }}</h2>
    <div>
      <p><span class="font-bold">{{ formatCurrency(pool.totalBalance) }}</span> {{ pool.currency }}</p>
      <p class="text-sm">TVL</p>
    </div>
    <div>
      <p><span class="font-bold">{{ formatPercent(pool.apr) }}</span></p>
      <p class="text-sm">APR</p>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-emerald-400 font-bold">{{ formatCurrency(pool.dealBalance) }}</p>
        <p class="text-sm">{{ pool.currency }}<br>in deals</p>
      </div>
      <div>
        <CounterChart
          class="h-20 w-20"
          :data="chartData"></CounterChart>
      </div>
      <div>
        <p class="text-purple-700 font-bold">{{ formatCurrency(pool.unallocatedBalance) }}</p>
        <p class="text-sm">{{ pool.currency }}<br>unallocated</p>
      </div>
    </div>
    <button class="mt-8 flex items-center justify-center rounded p-4 bg-purple-700 text-white font-bold drop-shadow-lg transition-all hover:scale-105" @click="modalOpen = true">Details</button>
    <PoolModal v-if="modalOpen" :pool="pool" @close="modalOpen = false" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { filters } from '~/utilities/filters'
import { Pool } from '~/types'
import CounterChart from '~/components/ui/charts/CounterChart.vue'
import PoolModal from '~/components/domain/pools/PoolModal.vue'

export default defineComponent({
  components: {
    CounterChart,
    PoolModal
  },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true
    },
    invested: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      modalOpen: false
    }
  },

  computed: {
    chartData() {
      return [this.pool.dealBalance, this.pool.unallocatedBalance]
    }
  },

  methods: {
    formatCurrency: filters.currency,
    formatPercent: filters.percent
  },

})
</script>
