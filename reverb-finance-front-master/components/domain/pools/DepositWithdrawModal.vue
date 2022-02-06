<template>
  <NooniModal modal-class="z-20" @close="$emit('close')">
    <div class="p-8 text-center w-96">
      <h2 class="text-xl font-bold mb-4">{{ pool.name }}</h2>
      <div class="flex font-bold mt-16">
        <div class="w-1/2 border-emerald-400 cursor-pointer" :class="currentAction === 'deposit' ? 'border-b-4' : 'border-b'" @click="currentAction = 'deposit'">Deposit</div>
        <div class="w-1/2 border-emerald-400 cursor-pointer" :class="currentAction === 'withdraw' ? 'border-b-4' : 'border-b'" @click="currentAction = 'withdraw'">Withdraw</div>
      </div>
      <div class="mt-8 text-emerald-400 text-lg">
        <p class="text-right">your balance: {{ formatCurrency(currentAction === 'withdraw' ? userBalance : usdcBalance, pool.currency) }}</p>
        <input v-model="amount" class="p-2 border border-emerald-400 rounded-lg w-full drop-shadow-lg" type="number">
      </div>
      <button :class="{ 'cursor-not-allowed	opacity-50': loading }" class="flex items-center justify-center mt-8 w-full rounded-lg p-4 text-white bg-emerald-400 font-bold drop-shadow-lg transition-all hover:scale-105" @click="submit" >
        <span v-if="loading" class="mr-2">
          <svg class="animate-spin text-white h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ capitalize(currentAction) }}
      </button>
    </div>

  </NooniModal>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { mapActions } from 'vuex'
import { filters } from '~/utilities/filters'
import { Pool } from '~/types'
import NooniModal from '~/components/ui/NooniModal.vue'
import { round, getSigner } from '~/utilities/utils'
import { _usdcBalance } from '~/utilities/fetch-data.js'

export default defineComponent({

  components: {
    NooniModal,
  },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true
    },
    defaultAction: {
      type: String as PropType<'deposit' | 'withdraw'>,
      default: 'deposit'
    }
  },

  data() {
    return {
      currentAction: 'deposit',
      usdcBalance: null,
      amount: null,
      loading: false
    }
  },

  computed: {
    userBalance () {
      return round(this.pool.userLpBalance / this.pool.totalLpBalance * this.pool.totalBalance, 2)
    },

    lpAmount () {
      return round(this.amount / this.pool.totalBalance * this.pool.totalLpBalance, 2)
    }
  },

  async created () {
    this.currentAction = this.defaultAction
    this.usdcBalance = (await _usdcBalance(await getSigner())) as number
  },
  methods: {
    ...mapActions({
      deposit: 'deposit',
      withdraw: 'withdraw',
    }),

    formatCurrency: filters.currency,
    capitalize: filters.capitalize,

    async submit () {
      if (this.loading) return
      if (!this.amount || this.amount < 0) return alert('Invalid amount')
      if (this.currentAction === 'withdraw' && this.amount > (this.userBalance as number)) return alert('Insufficient balance')
      this.loading = true
      try {
        if (this.currentAction === 'deposit') await this.deposit({ amount: round(this.amount, 0) })
        if (this.currentAction === 'withdraw') await this.withdraw({ lpAmount: round(this.lpAmount, 0) })
      } finally {
        this.loading = false
      }
      this.$emit('close')
    }
  },


})
</script>
