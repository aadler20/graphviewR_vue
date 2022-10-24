<template>
  <p-graph :loading="loadingLocal" :data="graphData" :width="width" :height="height"/>
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
      type: Array,
      default: () => {
        return []
      }
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
    },
    loading: function (value) {
      this.loadingLocal = value
    }
  },
  data () {
    return {
      width: 1000,
      height: 600,
      graphData: null,
      loadingLocal: this.loading
    }
  },
  created () {
  },
  methods: {
    loadPackageGraph () {
      return new Promise((resolve, reject) => {
        this.loadingLocal = true
        const param = { localPackages: this.data, colNames: this.names }
        getPackageGraph(param).then(res => {
          this.graphData = res || { nodes: [] }
          resolve(true)
        }).catch(err => {
          console.log('loadPackageGraph.err', err)
          this.$message.error('Fail to load package graph!')
          reject(err)
        }).finally(() => {
          this.loadingLocal = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
