<template>
  <a-card
    :tabList="tabList"
    :bordered="false"
    :body-style="{padding: '0'}"
    :activeTabKey="tabActiveKey"
    @tabChange="key => handleTabChange(key)">
    <router-view />
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
import { hasInternet } from '@/api/utils'

const getActiveKey = (path) => {
  if (path.includes('/function/listview/')) return '1'
  else if (path.includes('/function/diagram/')) return '2'
  else if (path.includes('/function/examples/')) return '3'
  return '1'
}

export default {
  name: 'FunctionInfo',
  data () {
    return {
      tabList: [
        { key: '1', tab: 'List View' },
        { key: '2', tab: 'Diagram View' },
        { key: '3', tab: 'Examples' }
      ],
      tabActiveKey: '1',
      search: true,
      packageName: '',
      functionName: '',
      loading: false,
      searchUrl: 'https://www.r-project.org',
      hasInternet: true
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.functionName = this.$route.params.functionName
    this.tabActiveKey = getActiveKey(this.$route.path)
    this.$watch('$route', (val) => {
      this.tabActiveKey = getActiveKey(val.path)
    })
  },
  methods: {
    onSearch (value) {
      this.buildSearchUrl(value)
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
    },
    handleTabChange (key) {
      this.tabActiveKey = key
      switch (key) {
        case '1':
          this.$router.push({ path: '/function/listview/' + this.packageName + '/' + this.functionName })
          break
        case '2':
          this.$router.push({ path: '/function/diagram/' + this.packageName + '/' + this.functionName })
          break
        case '3':
          this.$router.push({ path: '/function/examples/' + this.packageName + '/' + this.functionName })
          break
        default:
          this.$router.push('/settings/workplace')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-page-header-search {
  text-align: center;
  margin-bottom: 8px;
}
</style>
