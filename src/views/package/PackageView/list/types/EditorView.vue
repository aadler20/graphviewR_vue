<template>
  <a-table
    rowKey="Package"
    ref="table"
    :columns="tblColumns"
    :data-source="packageTable"
    :pagination="pagination"
    :loading="loading"
    :rowSelection="rowSelection">
  </a-table>
</template>

<script>
import { StandardFormRow, STable, ArticleListContent } from '@/components'
import IconText from '../components/IconText'
import { getPackageTable } from '@/api/package'

const tblColumns = [
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

export default {
  name: 'EditorView',
  components: {
    StandardFormRow,
    STable,
    ArticleListContent,
    IconText
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
      this.loadPackageTable()
    }
  },
  data () {
    this.tblColumns = tblColumns
    return {
      packageTable: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        page: 1,
        pageSize: 5
      },
      columns: [], // all columns
      hover: false,
      selectedRowKey: []
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
  },
  methods: {
    loadPackageTable () {
      return new Promise((resolve, reject) => {
          this.loading = true
          const param = { localPackages: this.data, colNames: this.names }
          getPackageTable(param).then(res => {
            this.packageTable = res.data || []
            resolve(true)
          }).catch(err => {
            console.log('loadPackageTable.err', err)
            this.$message.error('Fail to load package table!')
            reject(err)
          }).finally(() => {
            this.loading = false
          })
        }
      )
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKey = selectedRowKeys
    },
    onOk () {
      console.info('listen modal ok event')
      const param = this.selectedRowKey
      return new Promise((resolve, reject) => {
        if (param.length > 1) {
          reject(param)
        } else {
          console.info('param in EditorView', param)
          this.$emit('callback', param)
          resolve(true)
        }
      })
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
