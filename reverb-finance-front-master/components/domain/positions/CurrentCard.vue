<template>
  <div class="flex items-center justify-between rounded-lg bg-gray-100 drop-shadow-md py-8 px-16">
    <div class="flex items-center w-4/6">
      <div class="mr-8">
        <p><span class="font-bold text-2xl">{{ formatCurrency(position.totalBalance) }}</span> {{ position.currency }}</p>
        <p>Current balance</p>
      </div>
      <div>
        <CounterChart
          class="h-40 w-40"
          :data="[position.dealBalance, position.unallocatedBalance]"></CounterChart>
      </div>
      <div class="ml-8 flex flex-col justify-between">
        <div class="mb-8">
          <p class="text-emerald-400"><span class="font-bold text-xl">{{ formatCurrency(position.dealBalance) }}</span> {{ position.currency }}</p>
          <p>in deals</p>
        </div>
        <div>
          <p class="text-purple-700"><span class="font-bold text-xl">{{ formatCurrency(position.unallocatedBalance) }}</span> {{ position.currency }}</p>
          <p>unallocated (in DeFi)</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between w-2/6">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <p><span class="font-bold">{{ formatCurrency(position.earnings) }}</span> {{ position.currency }}</p>
          <p>earnings</p>
        </div>
        <div class="ml-12">
          <p><span class="font-bold">{{ formatPercent(position.apr) }}</span></p>
          <p>actual APR</p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p><span class="font-bold">{{ position.poolCount }}</span></p>
          <p>pools</p>
        </div>
        <div class="ml-12">
          <p><span class="font-bold">{{ position.activeDealCount }}</span></p>
          <p>active deals</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { filters } from '~/utilities/filters'
import CounterChart from '~/components/ui/charts/CounterChart.vue'
import { CurrentPosition } from '~/types'

export default defineComponent({
  components: {
    CounterChart
  },

  props: {
    position: {
      type: Object as PropType<CurrentPosition>,
      required: true
    }
  },

  methods: {
    formatCurrency: filters.currency,
    formatPercent: filters.percent
  },

})
</script>
