<template>
  <div>
    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false" v-show="viewType === 'table'">
          <table-view
            :loading="loading"
            :data="localPackages"
            :names="colNames">
          </table-view>
        </a-card>
        <a-card :bordered="false" :style="{ marginBottom: '24px' }" v-show="viewType === 'graph'">
          <graph-view
            :loading="loading"
            :data="localPackages"
            :names="colNames">
          </graph-view>
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
                  :fixed="fixedPrior"
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
import GraphView from './types/GraphView.vue'
import TableView from './types/TableView.vue'
import { getFirstLetters, getLocalPackages } from '@/api/package'
import { TagSelect } from '@/components'

const TagSelectOption = TagSelect.Option
const priorities = [
  { key: 'base', value: 'base', checked: true },
  { key: 'recommended', value: 'recommended', checked: false },
  { key: 'non', value: 'non', checked: false }
]

export default {
  name: 'PackageTable',
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
    },
    localPackages (value1, value2) {
    }
  },
  components: {
    TagSelect,
    TagSelectOption,
    GraphView,
    TableView
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
      hideCheckAll: true
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loadFirstLetters().then(() => {
        this.loadLocalPackages()
      })
    },
    /**
    handleViewChange (viewType) {
      switch (viewType) {
        case 'table':
          this.$router.push('/package/tableview')
          break
        case 'graph':
          this.$router.push('/package/graphview')
          break
        default:
          this.$router.push('/package/tableview')
      }
    },**/
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
