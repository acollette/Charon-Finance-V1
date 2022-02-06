<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Pool
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Deal amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Deal APR
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Odd row -->
              <tr v-for="(item, i) in items" :key="i" :class="i%2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.pool.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(item.amount, item.currency) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatPercent(item.apr) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { filters } from '~/utilities/filters'
import { Deal } from '~/types'

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<Deal[]>,
      required: true
    }
  },

  methods: {
    formatCurrency: filters.currency,
    formatPercent: filters.percent
  }
})
</script>
