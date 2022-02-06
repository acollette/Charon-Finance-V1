<template>
  <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
    <div class="flex-shrink-0">
      <img class="h-48 w-full object-cover" :src="blogPost.url" alt="" />
    </div>
    <div class="flex-1 bg-white p-6 flex flex-col justify-between">
      <div class="flex-1">
        <div class="flex items-center">
          <div class="w-20 text-white bg-emerald-400 rounded p-2 text-center font-bold text-sm">
            NEW
          </div>
          <p class="ml-4 font-semibold text-gray-900">
            {{ blogPost.title }}
          </p>
        </div>
        <p class="mt-3 text-sm text-gray-500 text-justify">
          {{ blogPost.text }}
        </p>
      </div>
      <button class="mt-6 text-purple-700 transition-all hover:scale-110">Read</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { BlogPost } from '~/types'

export default defineComponent({

  props: {
    blogPost: {
      type: Object as PropType<BlogPost>,
      required: true
    }
  }
})
</script>
