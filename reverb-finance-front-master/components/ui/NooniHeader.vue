<template>
  <div class="flex items-center justify-between ">
    <NooniLogo />
    <button v-if="!walletAddress" class="h-12 flex items-center justify-center rounded p-4 bg-purple-700 text-white text-lg font-bold transition-all hover:scale-105" @click="connect">Connect my wallet</button>
    <button v-else class="h-12 flex items-center justify-center rounded p-4 bg-purple-700 text-white text-lg font-bold transition-all hover:scale-105">{{ walletAddress.slice(0, 15) }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapState, mapActions } from 'vuex'
import NooniLogo from '~/components/ui/NooniLogo.vue'

export default defineComponent({
  components: {
    NooniLogo
  },

  computed: {
    ...mapState({
      walletAddress: 'walletAddress'
    })
  },

  methods: {
    ...mapActions({
      connect: 'connectWallet'
    })
  }
})
</script>
