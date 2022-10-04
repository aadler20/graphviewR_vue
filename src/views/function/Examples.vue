<template>
  <a-row :gutter="24">
    <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
      <a-card :bordered="false" :body-style="{padding: '0'}">
        <div class="salesCard">
          <a-tabs
            default-active-key="1"
            size="large"
            :tab-bar-style="{marginBottom: '8px', paddingLeft: '16px'}">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <div class="extra-item">
                <a-button type="text" @click="saveCode()" :disabled="loading">SAVE</a-button>
              </div>
              <div class="extra-item">
                <a-button type="primary" @click="evalCode()" :disabled="loading">RUN</a-button>
              </div>
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item @click="setTheme('vs-dark')">vs-dark</a-menu-item>
                    <a-menu-item @click="setTheme('hc-black')">hc-black</a-menu-item>
                    <a-menu-item @click="setTheme('vs')">vs</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </div>
            <a-tab-pane :tab="fileName" key="1" :loading="loading">
              <monaco-editor-r @codeInput="getInput" v-model="code" :code="code" :theme="theme" :minimap="minimap"/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
      <a-card title="Run Results" :bordered="false">
        <a-list size="small">
          <a-list-item :key="index" v-for="(item, index) in result">
            <a-table
              rowKey="id"
              ref="table"
              size="small"
              :columns="tblColumns"
              :data-source="item"
              :showHeader="false"
              :pagination="false"
              @expand="handleExpand">
              <p slot="expandedRowRender" slot-scope="innerRecord">
                <a-table
                  rowKey="id"
                  ref="table"
                  size="small"
                  :columns="tblColumns1"
                  :data-source="innerRecord.structure"
                  :showHeader="false"
                  :pagination="false"/>
              </p>
            </a-table>
          </a-list-item>
        </a-list>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { STable } from '@/components'
import MonacoEditorR from '@/components/MonacoEditorR/MonacoEditorR'
import { evalCode, saveCode } from '@/api/editor'
import { getFunctionExamples } from '@/api/function'

const tblColumns = [
  {
    title: 'RN',
    key: 'RN',
    dataIndex: 'RN'
  },
  {
    title: 'Class',
    key: 'Class',
    dataIndex: 'Class'
  }
]

const tblColumns1 = [
  {
    title: 'names',
    key: 'names',
    dataIndex: 'names'
  },
  {
    title: 'value',
    key: 'value',
    dataIndex: 'value'
  }
]

export default {
  name: 'Example',
  components: { MonacoEditorR, STable },
  watch: {
    theme (value) {
      console.log('watch theme', value)
    },
    code (value) {
      console.log('watch code', value)
    }
  },
  data () {
    return {
      code: null,
      codeDir: null,
      fileName: 'examples.r',
      ifRun: 'RUN',
      loading: false,
      themes: ['vs-dark', 'hc-black', 'vs'],
      theme: 'vs-dark',
      minimap: false,
      T: null,
      result: [],
      tblColumns,
      tblColumns1
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.functionName = this.$route.params.functionName
    this.fileName = this.packageName + '/' + this.functionName + '/examples.r'
    this.setCode()
  },
  mounted () {
  },
  methods: {
    evalCode () {
      this.loading = true
      this.result = []
      clearInterval(this.T)
      console.log('runRCode', this.code)
      // 执行测试
      this.T = setTimeout(() => {
        console.log('setTimeout')
        evalCode({
          code: this.code
        }).then(res => {
          const result = res.data
          // result.forEach((item, index) => {
          //  result[index] = [item]
          // })
          // this.result = result
          this.result = result.map((item) => [item])
          console.info('result', this.result)
          this.loading = false
          console.log('clearTimeout')
          clearTimeout(this.T)
          this.T = null
        }).catch(err => {
          clearTimeout(this.T)
          this.T = null
          this.loading = false
          this.$notification['error']({
            message: 'error',
            description: err || 'run failed',
            duration: 2
          })
        })
      }, 200)
    },
    getInput (currentCode) {
      this.code = currentCode
      console.info('currentCode in getInput', currentCode)
      console.info('this.code by getInput', this.code)
    },
    saveCode () {
      this.loading = true
      console.info('code to save', this.code)
      saveCode({
        code: this.code,
        codeDir: this.codeDir
      }).then(res => {
        console.info('save code', res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$notification['error']({
          message: 'error',
          description: err || 'failed saving code',
          duration: 2
        })
      })
    },
    onChangeTabs (item) {
      console.info('item', item)
    },
    setTheme (theme) {
      this.theme = theme
    },
    setCode () {
      this.loading = true
      return getFunctionExamples({ packageName: this.packageName,
        functionName: this.functionName }).then(res => {
        console.info('examples res', res)
        this.code = res.examples
        this.codeDir = res.fileDir
        console.info('examples code', this.code)
        this.loading = !this.loading
      }).catch(err => {
        console.log('loadExamples.err', err)
        this.$message.error('Fail to load Function examples!')
      })
    },
    handleExpand (expanded, record) {
      console.log('expanded', expanded, record)
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}
.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0,0,0,.45);
    cursor: pointer;
    transition: color .32s;
    color: black;
  }
}
.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    line-height: 20px;
  }
}
</style>
