<template>
  <div class="bg-emerald-400 min-h-screen px-16 py-8">
    <NooniHeader />
    <div class="flex w-full mt-8">
      <NooniSidebar :section="section" class="w-56 shrink-0" />
      <Nuxt :key="appId" class="min-h-[40rem] bg-white grow rounded-lg p-16"/>
    </div>
    <PortalTarget name="modals" multiple/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import NooniHeader from '~/components/ui/NooniHeader.vue'
import NooniSidebar from '~/components/ui/NooniSidebar.vue'

export default defineComponent({
  components: {
    NooniHeader,
    NooniSidebar
  },
  data () {
    return {
      appId: Math.random().toString()
    }
  },
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
      }
    ]
  },
  computed: {
    section() {
      return this.$route.path.split('/')[1]
    }
  },
  created () {
    const network = this.$route.query.network
    const poolAddress = this.$route.query.pool_address
    if (typeof network === 'string') localStorage.setItem('network', network)
    if (typeof poolAddress === 'string') localStorage.setItem('poolAddress', poolAddress)
    this.$nuxt.$on('poolFetched', () => {
      this.appId = Math.random().toString()
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('poolFetched')
  },
})
</script>

<style>
  body {
    font-family: Poppins;
    font-size: 16px;
  }
</style>
