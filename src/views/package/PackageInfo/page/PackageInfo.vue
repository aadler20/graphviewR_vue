<template>
  <a-card :loading="loading" :bordered="false" :style="{ marginBottom: '24px' }">
    <info-page :data="packageInfo" :width="width" :height="height" :title="packageName" :level="listLevel"/>
  </a-card>
</template>

<script>
import { InfoPage } from '@/components'
import { getPackageInfo } from '@/api/package'

export default {
  name: 'PackageInfo',
  components: {
    InfoPage
  },
  data () {
    return {
      packageName: '',
      packageInfo: [],
      width: 1000,
      height: 600,
      loading: true,
      listLevel: 'Function'
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.init()
  },
  methods: {
    init () {
      this.reloadData()
    },
    loadPackageInfo () {
      return getPackageInfo({ packageName: this.packageName }).then(res => {
        const description = res.packageInfo['package']
        const functionList = res.packageInfo['Rd']
        this.packageInfo = { 'descriptions': description, 'functionList': functionList }
      }).catch(err => {
        console.log('loadPackageInfo.err', err)
        this.$message.error('Fail to load package info!')
      }).finally(() => {
        this.loading = false
      })
    },
    reloadData () {
      this.packageInfo = []
      this.loadPackageInfo()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
