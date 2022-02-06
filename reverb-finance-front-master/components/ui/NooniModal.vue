<template>
  <portal to="modals">
    <div :class="modalClass" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden h-screen" aria-hidden="true">&#8203;</span>
        <div class="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all relative">
          <button class="text-emerald-400 font-bold cursor-pointer absolute top-2 right-2 transition-all hover:scale-125" @click="$emit('close')">
            <XIcon class="w-10 h-10" />
          </button>
          <slot />
        </div>
      </div>
    </div>
  </portal>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import XIcon from "~/components/ui/icons/XIcon.vue"

export default defineComponent({
  components: {
    XIcon
  },

  props: {
    modalClass: {
      type: String,
      default: ''
    }
  }
})
</script>
