<template>
  <a-row :gutter="24">
    <a-col
      style="padding: 0 12px"
      :xl="6"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24">
      <a-card :bordered="false" title="Dependent Packages" class="ant-pro-components-tag-select">
        <a-form :form="form" layout="inline">
          <standard-form-row block style="padding-bottom: 11px;">
            <a-form-item>
              <tag-select v-if="!!depPackages && depPackages.length > 0" @change="handleTagSelectChange">
                <tag-select-option
                  v-for="(item, index) in depPackages"
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
    </a-col>
    <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24">
      <a-card :bordered="false" :style="{ marginBottom: '24px' }">
        <f-graph :loading="loading" :data="graphData" :width="width" :height="height" :title="title"/>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { TagSelect, StandardFormRow, FGraph } from '@/components'
import { getFunctionGraph } from '@/api/package'
const TagSelectOption = TagSelect.Option

export default {
  name: 'FunctionGraph',
  components: {
    FGraph,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  data () {
    return {
      packageName: null,
      allData: [],
      graphData: [],
      width: 1000,
      height: 600,
      loading: true,
      title: '',
      depPackages: [],
      pkgNames: []
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
    loadFunctionGraph () {
      return new Promise((resolve, reject) =>
        getFunctionGraph({ packageName: this.packageName }).then(res => {
          this.allData = res
          this.pkgNames = res.packages
          this.allData.packages.forEach(pkg => {
            this.depPackages.push({
              key: pkg,
              value: pkg,
              checked: true
            })
          })
          this.depPackages.find(i => i.key === 'base').checked = false
          this.pkgNames = this.depPackages.filter(i => i.checked).map(i => i.key)
          this.refreshData()
          resolve(true)
        }).catch(err => {
          console.log('loadFunctionGraph.err', err)
          this.$message.error('Fail to load function graph!')
          reject(err)
        }).finally(() => {
          this.loading = false
        })
      )
    },
    reloadData () {
      this.loadFunctionGraph()
    },
    refreshData () {
      const graphData = {
        packages: this.pkgNames,
        edges: this.allData.edges,
        nodes: this.allData.nodes.filter(i => this.pkgNames.includes(i.package))
      }
      this.graphData = graphData
    },
    handleTagSelectChange ({ value, checked }) {
      let { depPackages } = this
      if (value === 'total') {
        if (checked) { // select all
          this.pkgNames = depPackages.map(i => i.key)
          depPackages = depPackages.map(i => {
            i.checked = true
            return i
          })
        } else { // inverse selections
          this.pkgNames = []
          depPackages = depPackages.map(i => {
            i.checked = false
            return i
          })
        }
      } else {
        // single selection
        const index = depPackages.findIndex(i => i.key === value)
        depPackages[index].checked = checked
      }
      this.pkgNames = depPackages.filter(i => i.checked).map(i => i.key)
      this.refreshData()
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
</style>
