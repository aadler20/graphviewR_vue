<template>
  <a-row :gutter="24">
    <a-col :xl="15" :lg="24" :md="24" :sm="24" :xs="24">
      <a-card :bordered="false" :body-style="{padding: '0'}">
        <div class="salesCard">
          <a-tabs
            default-active-key="1"
            size="large"
            :tab-bar-style="{marginBottom: '8px', paddingLeft: '16px'}">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <div class="extra-item">
                <a-button type="link" icon="plus" @click="openPackageList" :loading="loading" :disabled="loading">Package DEMO</a-button>
              </div>
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
              <monaco-editor-r
                @codeInput="getInput"
                v-model="code"
                :code="code"
                :refresh="refresh"
                :theme="theme"
                :minimap="minimap"/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>
    <a-col :xl="9" :lg="24" :md="24" :sm="24" :xs="24">
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
import PackageList from '@/views/editor/Demo/PackageList.vue'
import { getDemoCode } from '@/api/package'

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
  name: 'EditorR',
  components: {
    PackageList,
    MonacoEditorR,
    STable
  },
  watch: {
    code (value) {
      if (this.packageInfo) {
        this.refresh = true
        this.packageInfo = null
      } else {
        this.refresh = false
      }
    },
    packageInfo (value) {
      if (this.packageInfo) {
        this.setCode()
      }
    }
  },
  data () {
    return {
      code: 'print("Hello World!")',
      codeDir: null,
      fileName: 'hello.r',
      ifRun: 'RUN',
      loading: false,
      themes: ['vs-dark', 'hc-black', 'vs'],
      theme: 'vs-dark',
      minimap: false,
      T: null,
      result: [],
      tblColumns,
      tblColumns1,
      packageInfo: null,
      refresh: false
    }
  },
  created () {
    if (this.packageInfo) {
      this.setCode()
    }
  },
  mounted () {
  },
  methods: {
    openPackageList () {
      const that = this
      this.$dialog(PackageList,
        {
          on: {
            callback (item) {
              that.packageInfo = item[0]
            }
          }
        },
        {
          title: 'Load Package Demo',
          width: 850,
          centered: true,
          maskClosable: false
        }
      )
    },
    evalCode () {
      this.loading = true
      this.result = []
      clearInterval(this.T)
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
    },
    saveCode () {
      this.loading = true
      saveCode({
        code: this.code,
        codeDir: this.codeDir
      }).then(res => {
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
      console.info('theme', theme)
      this.theme = theme
    },
    setCode () {
      return getDemoCode({ packageInfo: this.packageInfo }).then(res => {
        this.code = res.demo
        this.codeDir = res.fileDir
      }).catch(err => {
        console.log('loadPackageDemo.err', err)
        this.$message.error('Fail to load package demo!')
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
