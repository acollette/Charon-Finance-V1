<template>
  <div>
    <h2 class="text-2xl mb-4">Pools</h2>
    <div class="flex flex-wrap gap-8">
      <PoolCard v-for="(pool, i) in pools" :key="i" :pool="pool" class="w-80" :invested="hasInvested(pool)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapState } from 'vuex'
import PoolCard from '~/components/domain/pools/PoolCard.vue'
import { Pool } from '~/types'


export default defineComponent({
  name: 'Pools',

  components: {
    PoolCard
  },

  computed: {
    ...mapState({
      pools: 'pools',
      investedPools: 'investedPools',
      walletAddress: 'walletAddress'
    })
  },

  methods: {
    hasInvested(pool: Pool) {
      if (!this.walletAddress) return false
      const foundPool = (this.investedPools.find((p: Pool) => p.address === pool.address))
      return !!foundPool
    }
  }
})
</script>
