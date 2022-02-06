<template>
  <div class="flex items-center justify-between rounded-lg bg-gray-100 drop-shadow-md p-4 text-sm w-[30rem] cursor-pointer transition-all hover:scale-105">
    <div class="w-4/12">{{ title }}</div>
    <div class="w-3/12">
      <p class="font-bold">{{ formatCurrency(amount) }}</p>
      <p class="text-xs">TVL</p>
    </div>
    <div class="w-2/12">
      <p class="font-bold">{{ formatPercent(apr) }}</p>
      <p class="text-xs">APR</p>
    </div>
    <div class="w-3/12 text-emerald-400 font-bold">
      more details
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck

import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { filters } from '~/utilities/filters'
import { Deal, Pool } from '~/types'

export default defineComponent({

  props: {
    item: {
      type: Object as PropType<Deal | Pool>,
      required: true
    }
  },

  computed: {
    title() {
      return this.item.name || this.item.customer
    },

    amount() {
      return this.item.totalBalance || this.item.amount
    },

    apr() {
      return this.item.apr
    }
  },

  methods: {
    formatCurrency: filters.currency,
    formatPercent: filters.percent
  },

})
</script>
