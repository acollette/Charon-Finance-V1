<template>
  <div>
    <h2 class="text-2xl mb-4">Your current position</h2>
    <CurrentPositionCard v-if="walletAddress && currentPosition" :position="currentPosition"/>
    <div v-else class="rounded-lg bg-gray-100 border-2 border-dashed h-48 border-purple-700 text-purple-700 drop-shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:bg-gray-200" @click="connect">
      Connect your wallet to access your balance
    </div>
    <h2 class="text-2xl my-4">Your active pools</h2>
    <div v-if="walletAddress" class="flex flex-wrap gap-8">
      <PoolCard v-for="(pool, i) in investedPools" :key="i" :pool="pool" class="w-80" invested />
    </div>
    <div v-else class="rounded-lg bg-gray-100 border-2 border-dashed h-48 border-purple-700 text-purple-700 drop-shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:bg-gray-200" @click="connect">
      Connect your wallet to access your balance
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapState, mapActions } from 'vuex'
import CurrentPositionCard from '~/components/domain/positions/CurrentCard.vue'
import PoolCard from '~/components/domain/pools/PoolCard.vue'

export default defineComponent({
  name: 'Dashboard',

  components: {
    CurrentPositionCard,
    PoolCard
  },

  computed: {
    ...mapState({
      walletAddress: 'walletAddress',
      currentPosition: 'currentPosition',
      investedPools: 'investedPools'
    })
  },

  methods: {
    ...mapActions({
      connect: 'connectWallet'
    })
  }
})
</script>
