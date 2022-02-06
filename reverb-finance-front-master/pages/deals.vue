<template>
  <div>
    <h2 class="text-2xl mb-4">Deals</h2>
    <DealsTable :items="deals"/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import DealsTable from '~/components/domain/deals/DealsTable.vue'


export default defineComponent({
  name: 'Deals',

  components: {
    DealsTable
  },

  computed: {
    ...mapGetters({
      deals: 'deals'
    })
  }
})
</script>
