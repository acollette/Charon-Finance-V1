<template>
  <div>
    <h2 class="text-2xl mb-4">Community</h2>
    <h3 class="text-xl font-bold text-emerald-400 mb-4">News</h3>
    <div class="flex flex-wrap justify-between gap-4">
      <BlogCard v-for="(blogPost, i) in blogPosts" :key="i" :blog-post="blogPost" class="w-72" />
    </div>
    <div class="mt-16 flex">
      <div class="w-1/2">
        <h3 class="text-xl font-bold text-emerald-400 mb-4">Hot pools 💦</h3>
        <HotItem v-for="(item, i) in pools.slice(0, 5)" :key="i" class="mt-4" :item="item" />
      </div>
      <div class="w-1/2">
        <h3 class="text-xl font-bold text-emerald-400 mb-4">Hot deals 🔥</h3>
        <HotItem v-for="(item, i) in deals.slice(0, 5)" :key="i" class="mt-4" :item="item" />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import BlogCard from '~/components/domain/community/BlogCard.vue'
import HotItem from '~/components/domain/community/HotItem.vue'

export default defineComponent({
  name: 'Community',

  components: {
    BlogCard,
    HotItem
  },

  computed: {
    ...mapGetters({
      deals: 'deals',
    }),
    ...mapState({
      pools: 'pools'
    }),
    blogPosts() {
      return [
        {
          url: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          title: "Yoga Room opens its latest studio",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In accusantium iure numquam ipsum esse repudiandae suscipit adipisci, aspernatur quos iste excepturi libero asperiores deleniti totam deserunt culpa eum recusandae eligendi!"
        },
        {
          url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
          title: "The 4 latest team productivity trends",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In accusantium iure numquam ipsum esse repudiandae suscipit adipisci, aspernatur quos iste excepturi libero asperiores deleniti totam deserunt culpa eum recusandae eligendi!"
        },
        {
          url: "https://images.unsplash.com/photo-1624362772755-4d5843e67047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          title: "5 benefits of vitamin E",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In accusantium iure numquam ipsum esse repudiandae suscipit adipisci, aspernatur quos iste excepturi libero asperiores deleniti totam deserunt culpa eum recusandae eligendi!"
        },
        {
          url: "https://images.unsplash.com/photo-1591291621060-89264efbeaed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          title: "How to choose the best yoga mat",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In accusantium iure numquam ipsum esse repudiandae suscipit adipisci, aspernatur quos iste excepturi libero asperiores deleniti totam deserunt culpa eum recusandae eligendi!"
        }
      ]
    }
  }
})
</script>
