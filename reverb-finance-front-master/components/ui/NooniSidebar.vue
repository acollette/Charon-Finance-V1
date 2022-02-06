<template>
  <div class="mt-16 flex flex-col">
    <nuxt-link to="/dashboard" class="w-full rounded-tl-full rounded-bl-full text-lg text-left p-6 flex" :class=" section === 'dashboard' ? 'bg-white text-purple-700' : 'text-white'"><ViewGridIcon class="mr-4"/> Dashboard</nuxt-link>
    <nuxt-link to="/pools" class="w-full rounded-tl-full rounded-bl-full text-lg text-left p-6 flex" :class=" section === 'pools' ? 'bg-white text-purple-700' : 'text-white'"><CubeTransparentIcon class="mr-4"/> Pools</nuxt-link>
    <nuxt-link to="/deals" class="w-full rounded-tl-full rounded-bl-full text-lg text-left p-6 flex" :class=" section === 'deals' ? 'bg-white text-purple-700' : 'text-white'"><TagIcon class="mr-4"/> Deals</nuxt-link>
    <nuxt-link to="/marketplace" class="w-full rounded-tl-full rounded-bl-full text-lg text-left p-6 flex" :class=" section === 'marketplace' ? 'bg-white text-purple-700' : 'text-white'"><RefreshIcon class="mr-4"/> Marketplace</nuxt-link>
    <nuxt-link to="/community" class="w-full rounded-tl-full rounded-bl-full text-lg text-left p-6 flex" :class=" section === 'community' ? 'bg-white text-purple-700' : 'text-white'"><UserGroupIcon class="mr-4"/> Community</nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import ViewGridIcon from '~/components/ui/icons/ViewGridIcon.vue'
import CubeTransparentIcon from '~/components/ui/icons/CubeTransparentIcon.vue'
import TagIcon from '~/components/ui/icons/TagIcon.vue'
import UserGroupIcon from '~/components/ui/icons/UserGroupIcon.vue'
import RefreshIcon from '~/components/ui/icons/RefreshIcon.vue'

export default defineComponent({
  components: {
    ViewGridIcon,
    CubeTransparentIcon,
    TagIcon,
    UserGroupIcon,
    RefreshIcon
  },

  props: {
    section: {
      type: String,
      required: true
    }
  }
})
</script>
