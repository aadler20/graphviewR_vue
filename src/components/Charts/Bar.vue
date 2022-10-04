<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <!--<h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>-->
    <v-chart
      height="254"
      :data="data"
      :forceFit="true"
      :scale="scale"
      :padding="['40', '60', '50', '30']">
      <v-axis />
      <v-tooltip />
      <v-bar position="x*y" label="y" :size="20" />
      <!--<v-smooth-line position="x*y" :size="3" />-->
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: ''
    },
    yAlias: {
      type: String,
      default: null
    },
    startDate: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    scale () {
      const scale = []
      scale.push(
        {
          dataKey: 'x',
          min: this.startDate
        },
        {
          dataKey: 'y',
          alias: this.yAlias
        }
      )
      return scale
    }
  },
  data () {
    return {
    }
  }
}
</script>
