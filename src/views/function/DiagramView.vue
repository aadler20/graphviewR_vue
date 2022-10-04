<template>
  <a-row :gutter="24">
    <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24">
      <a-card :loading="loading" :bordered="false" :style="{ marginBottom: '24px' }">
        <f-diagram :data="diagramData" :width="width" :height="height" :title="title" :name="functionName"/>
      </a-card>
    </a-col>
    <a-col
      style="padding: 0 12px"
      :xl="6"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24">
      <a-card :bordered="false" title="Dependent Functions" class="ant-pro-components-tag-select">
        <a-form :form="form" layout="inline">
          <standard-form-row block style="padding-bottom: 11px;">
            <a-form-item>
              <tag-select @change="handleTagSelectChange">
                <tag-select-option
                  v-for="(item, index) in priorities"
                  :key="index"
                  :value="item.key"
                  :checked="item.checked">
                  {{ item.value }}
                </tag-select-option>
              </tag-select>
            </a-form-item>
          </standard-form-row>
        </a-form>
      </a-card>
      <a-card
        :title="title2"
        style="margin-bottom: 24px"
        :bordered="false"
        :body-style="{ padding: 0 }"
      >
        <div style="min-height: 400px;"></div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
// import diagramData from '@/data/diagram'
import { TagSelect, StandardFormRow, FDiagram } from '@/components'
import { getFunctionHelp } from '@/api/function'
const TagSelectOption = TagSelect.Option

const priorities = [
  { key: 'base', value: 'base', checked: 'false' },
  { key: 'recommended', value: 'recommended', checked: 'true' },
  { key: 'high', value: 'high', checked: 'true' }
]

export default {
  name: 'DiagramView',
  components: {
    FDiagram,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  data () {
    return {
      packageName: '',
      functionName: '',
      diagramData: [],
      width: 1000,
      height: 600,
      loading: true,
      title: 'Function Diagram',
      title2: '',
      priorities: priorities
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.functionName = this.$route.params.functionName
    this.title2 = 'Functions in ' + this.packageName
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
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
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
