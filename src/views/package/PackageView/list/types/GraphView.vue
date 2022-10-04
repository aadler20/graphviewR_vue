<template>
  <p-graph :loading="loading" :data="graphData" :width="width" :height="height" :title="title"/>
</template>

<script>
import { PGraph } from '@/components'
import { getPackageGraph } from '@/api/package'

export default {
  name: 'GraphView',
  components: {
    PGraph
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    names: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: function (value) {
      this.loadPackageGraph()
    }
  },
  data () {
    return {
      width: 1000,
      height: 600,
      graphData: null
    }
  },
  created () {
  },
  methods: {
    loadPackageGraph () {
      return new Promise((resolve, reject) => {
        this.loading = true
        const param = { localPackages: this.data, colNames: this.names }
        getPackageGraph(param).then(res => {
          this.graphData = res || { nodes: [] }
          resolve(true)
        }).catch(err => {
          console.log('loadPackageGraph.err', err)
          this.$message.error('Fail to load package graph!')
          reject(err)
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
