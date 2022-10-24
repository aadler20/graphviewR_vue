<template>
  <a-table
    rowKey="id"
    ref="table"
    :columns="tblColumns"
    :data-source="packageTable"
    :pagination="pagination"
    :loading="loadingLocal"
    :customRow="handleClickRow">
    <template slot="Package" slot-scope="text, record">
      <!--<a :title="'help(package = \'' + record.Package + '\')'" @click="() => packageHelp(record.Package)">{{ text }}</a>-->
      <a :title="packageIntro" :ref="record.Package" @mouseenter="() => mouseEnter(record)" @mouseleave="() => mouseLeave(record)" @click="() => packageHelp(text)">{{ text }}</a>
    </template>
  </a-table>
</template>

<script>
import { StandardFormRow, STable, ArticleListContent } from '@/components'
import IconText from '../components/IconText'
import { getPackageTable } from '@/api/package'
import { tblColumns } from '../components/PackageColumns.js'

export default {
  name: 'TableView',
  components: {
    StandardFormRow,
    STable,
    ArticleListContent,
    IconText
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
      this.loadPackageTable()
    },
    loading: function (value) {
      this.loadingLocal = value
    }
  },
  data () {
    return {
      packageTable: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        page: 1,
        pageSize: 10
      },
      columns: [], // all columns
      tblColumns, // columns in the table
      hover: false,
      packageIntro: '',
      loadingLocal: this.loading
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
  },
  methods: {
    handleClickRow (record, index) {
      return {
        on: {
          click: () => {
            if (record.Package) {
              this.$router.push({ path: '/package/packageInfo/' + record.Package })
            }
          }
        }
      }
    },
    loadPackageTable () {
      return new Promise((resolve, reject) => {
          this.loadingLocal = true
          const param = { localPackages: this.data, colNames: this.names }
          getPackageTable(param).then(res => {
            this.packageTable = res.data || []
            resolve(true)
          }).catch(err => {
            console.log('loadPackageTable.err', err)
            this.$message.error('Fail to load package table!')
            reject(err)
          }).finally(() => {
            this.loadingLocal = false
          })
        }
      )
    },
    packageHelp (packageName) {
      console.info('packageName', packageName)
    },
    mouseEnter (packageRecord) {
      this.hover = true
      this.packageIntro = packageRecord.Description
      const textEL = this.$refs[packageRecord.Package]
      textEL.style = 'font-size:1' + 'rem;'
    },
    mouseLeave (packageRecord) {
      this.hover = false
      this.packageIntro = ''
      const textEL = this.$refs[packageRecord.Package]
      textEL.style.fontSize = 0.9 + 'rem'
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
