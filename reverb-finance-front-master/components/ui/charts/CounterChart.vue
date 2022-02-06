<template>
  <canvas :id="chartRef" :ref="chartRef"></canvas>
</template>

<script>
  import Chart from 'chart.js/auto'


  export default {
    props: {
      data: {
        type: Array,
        required: true
      },
      colors: {
        type: Array,
        default: () => [
          '#34d399',
          '#7e22ce',
        ]
      }
    },
    computed: {
      chartRef () {
        return Math.random().toString()
      }
    },
    mounted () {
      const ctx = this.$refs[this.chartRef]
      new Chart(ctx, { // eslint-disable-line
        type: 'doughnut',
        data: {
          datasets: [{
            data: this.data,
            backgroundColor: this.colors,
          }]
        }
      }
    )
  }
  }
</script>

