<template>
  <a-card
    :tabList="tabList"
    :bordered="false"
    :body-style="{padding: '0'}"
    :activeTabKey="tabActiveKey"
    @tabChange="key => handleTabChange(key)">
    <package-info v-if="tabActiveKey === '1'"></package-info>
    <function-graph v-else-if="tabActiveKey === '2'"></function-graph>
    <div class="extra-wrapper" slot="tabBarExtraContent">
      <a-input-search
        style="width: 90%; max-width: 522px;"
        placeholder="key words site search"
        @search="onSearch"
      />
    </div>
  </a-card>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { FunctionGraph, PackageInfo } from './page'
import { hasInternet } from '@/api/utils'

/*
const getActiveKey = (path) => {
  if (path.indexOf('/package/packageInfo/packageInfo/') !== -1) {
    return '1'
  } else if (path.indexOf('/package/packageInfo/functionGraph/') !== -1) {
    return '2'
  }
  return '1'
} */

export default {
  name: 'PackageBase',
  components: {
    RouteView,
    PageView,
    FunctionGraph,
    PackageInfo
  },
  data () {
    return {
      tabList: [
        { key: '1', tab: 'Package Info' },
        { key: '2', tab: 'Function Graph' }
      ],
      tabActiveKey: '1',
      search: true,
      packageName: null,
      searchUrl: 'https://www.r-project.org',
      hasInternet: true
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    /*
    this.$watch('$route', (val) => {
      this.tabActiveKey = getActiveKey(val.path)
    }) */
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    onSearch (value) {
      this.buildSearchUrl(value)
      console.info('searchUrl', this.searchUrl)
      hasInternet().then(res => {
        if (res) {
          window.open(this.searchUrl, '_blank')
        } else {
          this.$message.info('Failed to connect to Internet!')
        }
      })
    },
    buildSearchUrl (value) {
      const url = 'http://search.r-project.org/cgi-bin/namazu.cgi?query=%K&max=20&result=normal&sort=score&idxname=vignettes'
      this.searchUrl = url.replace('%K', value)
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  padding-right: 24px;
  padding-top: 8px;
}
</style>
