<template>
  <div>
    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false">
          <a-table
            rowKey="Package"
            ref="table"
            size="small"
            :columns="listColumns"
            :data-source="packageDemo"
            :pagination="pagination"
            :loading="loading"
            @expand="handleExpand">
            <p slot="expandedRowRender" slot-scope="innerRecord">
              <a-table
                rowKey="id"
                ref="table"
                size="small"
                :columns="tblColumns1"
                :data-source="innerRecord.demo"
                :showHeader="false"
                :pagination="false"
                :rowSelection="rowSelection"/>
            </p>
          </a-table>
        </a-card>
      </a-col>
      <a-col
        style="padding: 0 12px"
        :xl="8"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24">
        <a-card
          title="Packages by Priority"
          :bordered="false"
          style="margin-bottom: 24px"
          class="ant-pro-components-tag-select">
          <a-form layout="inline">
            <standard-form-row block>
              <a-form-item>
                <tag-select
                  v-if="!!priorities && priorities.length > 0"
                  :hideCheckAll="hideCheckAll"
                  @change="handlePriorityChange">
                  <tag-select-option
                    v-for="(item, index) in priorities"
                    :key="index"
                    :value="item.value"
                    :checked="item.checked">
                    {{ item.value }}
                  </tag-select-option>
                </tag-select>
              </a-form-item>
            </standard-form-row>
          </a-form>
        </a-card>
        <a-card
          title="First Letter of Package"
          class="ant-pro-components-tag-select"
          :bordered="false"
          style="{ fontFamily: 'bold' }"
        >
          <a-form layout="inline">
            <standard-form-row block style="padding-bottom: 11px;">
              <a-form-item>
                <tag-select
                  v-if="!!firstLetters && firstLetters.length > 0"
                  prefixCls="FirstLetters"
                  @change="handleFirstLetterChange">
                  <tag-select-option
                    v-for="(item, index) in firstLetters"
                    :key="index"
                    :value="item.value"
                    :checked="item.checked">
                    {{ item.value }}
                  </tag-select-option>
                </tag-select>
              </a-form-item>
            </standard-form-row>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { StandardFormRow, STable, TagSelect, ArticleListContent } from '@/components'
import { getFirstLetters, getLocalPackages, getPackageDemo } from '@/api/package'
import IconText from '@/views/package/PackageView/list/components/IconText'

const TagSelectOption = TagSelect.Option
const priorities = [
  { key: 'base', value: 'base', checked: true },
  { key: 'recommended', value: 'recommended', checked: false },
  { key: 'non', value: 'non', checked: false }
]
const listColumns = [
  {
    title: 'Package',
    key: 'Package',
    dataIndex: 'Package',
    scopedSlots: { customRender: 'Package' }
  },
  {
    title: 'Description',
    key: 'Description',
    dataIndex: 'Description'
  }
]

const tblColumns1 = [
  {
    title: 'Package',
    key: 'Package',
    dataIndex: 'Package',
    scopedSlots: { customRender: 'Package' }
  },
  {
    title: 'Item',
    key: 'Item',
    dataIndex: 'Item'
  },
  {
    title: 'Title',
    key: 'Title',
    dataIndex: 'Title'
  }
]

export default {
  name: 'PackageList',
  props: {
    viewType: {
      type: String,
      default: function () {
        return 'table'
      }
    }
  },
  watch: {
    viewType (value1, value2) {
    }
  },
  components: {
    TagSelect,
    TagSelectOption,
    IconText,
    StandardFormRow,
    STable,
    ArticleListContent
  },
  data () {
    this.priorities = priorities
    return {
      loading: false,
      sPriorities: ['base'],
      firstLetters: [],
      sFirstLetters: [],
      localPackages: null,
      colNames: [],
      hideCheckAll: true,
      packageDemo: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        page: 1,
        pageSize: 5
      },
      columns: [], // all columns
      listColumns: listColumns,
      tblColumns1: tblColumns1,
      hover: false,
      selectedRowKey: [],
      selectedRow: []
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    },
    rowSelection () {
      return {
        selectedRowKey: this.selectedRowKey,
        onChange: this.onSelectChange,
        type: 'radio' // single choice else multiple
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loadFirstLetters().then(() => {
        this.loadLocalPackages().then(() => {
          this.loadPackageDemo()
        })
      })
    },
    loadFirstLetters () {
      return getFirstLetters({ priorities: this.sPriorities }).then(res => {
        this.firstLetters = res.data || []
        this.sFirstLetters = res.sLetters || []
      }).catch(err => {
        console.log('loadFirstLetters.err', err)
        this.$message.error('Error on loading first letters.')
      })
    },
    loadLocalPackages () {
      return new Promise((resolve, reject) => {
          const param = { priorities: this.sPriorities, letters: this.sFirstLetters }
          this.localPackages = null
          getLocalPackages(param).then(res => {
            this.localPackages = res.data.localPackages || []
            this.colNames = res.data.colNames || []
            resolve(true)
          }).catch(err => {
            console.log('loadLocalPackages.err', err)
            this.$message.error('Fail to load local packages!')
            reject(err)
          }).finally(() => {
          })
        }
      )
    },
    handlePriorityChange ({ value, checked }) {
      let { priorities } = this
      if (value === 'total') { // all
        if (checked) {
          this.sPriorities = priorities.map(i => i.key)
          priorities = priorities.map(i => {
            i.checked = true
            return i
          })
        } else { // reverse
          this.sPriorities = []
          priorities = priorities.map(i => {
            i.checked = false
            return i
          })
        }
      } else {
        // single
        const index = priorities.findIndex(i => i.key === value)
        priorities[index].checked = checked
      }
      this.sPriorities = priorities.filter(i => i.checked).map(i => i.key)
      if (this.sPriorities.length === 0) {
        this.sPriorities = []
        this.firstLetters = []
        // const index0 = priorities.findIndex(i => i.key === 'base')
        // priorities[index0].checked = true
      }
      this.init()
    },
    handleFirstLetterChange ({ value, checked }) {
      let { firstLetters } = this
      if (value === 'total') { // all
        if (checked) {
          this.sFirstLetters = firstLetters.map(i => i.key)
          firstLetters = firstLetters.map(i => {
            i.checked = true
            return i
          })
        } else { // reverse
          this.sFirstLetters = []
          firstLetters = firstLetters.map(i => {
            i.checked = false
            return i
          })
        }
      } else {
        // single
        const index = firstLetters.findIndex(i => i.key === value)
        firstLetters[index].checked = checked
      }
      this.sFirstLetters = firstLetters.filter(i => i.checked).map(i => i.key)
      console.info('FirstLetters', this.sFirstLetters)
      this.loadLocalPackages()
    },
    loadPackageDemo () {
      return new Promise((resolve, reject) => {
          const param = { localPackages: this.localPackages, colNames: this.colNames }
          getPackageDemo(param).then(res => {
            const packageDemo = res.data
            // packageDemo.forEach((item, index) => {
            //  packageDemo[index] = [item]
            // })
            // this.packageDemo = packageDemo
            // this.packageDemo = packageDemo.map((item) => [item])
            this.packageDemo = packageDemo
            console.info('packageDemo', this.packageDemo)
            resolve(true)
          }).catch(err => {
            console.log('loadPackageDemo.err', err)
            this.$message.error('Fail to load package table!')
            reject(err)
          }).finally(() => {
          })
        }
      )
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKey = selectedRowKeys
      this.selectedRow = selectedRows
    },
    onOk () {
      console.log('modal OK event listened')
      return new Promise(resolve => {
        this.$emit('callback', this.selectedRow)
        resolve(true)
      })
    },
    onCancel () {
      console.log('modal Cancel event listened')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleExpand (expanded, record) {
      console.log('expanded', expanded, record)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: rgba(0,0,0,.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
</style>
