<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <package-table :viewType="tabActiveKey"></package-table>
  </page-header-wrapper>
</template>

<script>
import PackageTable from './list/PackageTable.vue'

const getActiveKey = (path) => {
  switch (path) {
    case '/package/tableview':
      return 'table'
    case '/package/graphview':
      return 'graph'
    default:
      return 'table'
  }
}
export default {
  name: 'BaseFrame',
  components: { PackageTable },
  watch: {
    tabActiveKey (value) {
      console.log('watch tabActiveKey', value)
    }
  },
  data () {
    return {
      tabList: [
        { key: 'table', tab: 'Table View' },
        { key: 'graph', tab: 'Graph View' }
      ],
      tabActiveKey: 'table',
      search: true
    }
  },
  created () {
    this.tabActiveKey = getActiveKey(this.$route.path)

    this.$watch('$route', (val) => {
      this.tabActiveKey = getActiveKey(val.path)
    })
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      switch (key) {
        case 'table':
          this.$router.push('/package/tableview')
          break
        case 'graph':
          this.$router.push('/package/graphview')
          break
        default:
          this.$router.push('/settings')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-page-header-search {
  text-align: center;
  margin-bottom: 16px;
}
.extra-wrapper {
  padding-right: 48px;
  padding-top: 12px;
}
</style>
