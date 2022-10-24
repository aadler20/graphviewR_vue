<template>
  <a-row :gutter="24">
    <a-card :loading="loading" :bordered="false" :style="{ marginBottom: '24px' }">
      <f-diagram :data="diagramData" :width="width" :height="height" :title="title" :name="functionName"/>
    </a-card>
  </a-row>
</template>

<script>
import { FDiagram } from '@/components'
import { getFunctionHelp } from '@/api/function'

export default {
  name: 'DiagramView',
  components: {
    FDiagram
  },
  data () {
    return {
      packageName: '',
      functionName: '',
      diagramData: [],
      width: 1000,
      height: 600,
      loading: true,
      title: 'Function Diagram'
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.functionName = this.$route.params.functionName
    this.reloadData()
  },
  methods: {
    loadFunctionHelp () {
      return new Promise((resolve, reject) =>
        getFunctionHelp({ packageName: this.packageName,
          functionName: this.functionName }).then(res => {
          this.diagramData = res.helpData || []
          this.loading = false
          resolve(true)
        }).catch(err => {
          console.log('loadFunctionHelp.err', err)
          this.$message.error('Fail to load function help!')
          reject(err)
        })
      )
    },
    reloadData () {
      this.diagramData = []
      this.loadFunctionHelp()
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      this.$http.get('/list/article', { params: { count: 8 } }).then(res => {
        console.log('res', res)
        this.data = res.result
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-pages-list-projects-cardList {
  margin-top: 24px;

  /deep/ .ant-card-meta-title {
    margin-bottom: 4px;
  }

  /deep/ .ant-card-meta-description {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
}
</style>
