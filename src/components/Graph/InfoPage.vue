<template>
  <div id="container" ref="container">
    <div v-if="data.flag!=='INFO404'">
      <a-card :bordered="false" :title="baseInfo">
        <a-row :gutter="24" type="flex" align="top" >
          <a-col
            v-for="(item, index) in descriptions"
            :key="index"
            :xs="9"
            :sm="7"
            :md="6"
            :lg="5"
            :xl="4"
            :xxl="3">
            <div><span><b>{{ item.Name }}:</b> {{ item.Value }}</span></div>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" :title="listInfo">
        <a-table
          rowKey="id"
          ref="table"
          :columns="tblColumns"
          :data-source="functionList"
          :loading="loading"
          :customRow="handleClickRow"
        >
          <template slot="Name" slot-scope="text, record">
            <a :title="columnIntro" :ref="record.Name">{{ text }}</a>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script>

import { STable } from '@/components'

export default {
  name: 'InfoPage',
  components: {
    STable
  },
  data () {
    return {
      descriptions: [],
      functionList: [],
      tblColumns: [],
      baseInfo: '',
      listInfo: '',
      columnIntro: ''
    }
  },
  props: {
   data: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 1000
    },
    height: {
      type: Number,
      default: 600
    },
    loading: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      default: ''
   }
  },
  computed: {
    /*
    descriptions () {
      console.info('descriptions', this.data)
      return this.data
    } */
  },
  mounted () {
    this.baseInfo = 'Base Info of R Package: ' + this.title
    this.listInfo = this.level + ' List of R Package: ' + this.title
    if (this.data.flag && this.data.flag === 'INFO404') {
      this.showInfo()
    } else {
      this.descriptions = this.data.descriptions
      this.functionList = this.data.functionList
      const datColumns = Object.keys(this.functionList[[0]])
      console.info('datColumns in InfoPage', datColumns)
      datColumns.forEach(datColumn => {
        this.tblColumns.push({
          'dataIndex': datColumn,
          'key': datColumn,
          'title': datColumn
        })
      })
      this.setColumnSlot(this.tblColumns)
    }
    // this.showPage()
  },
  methods: {
    showInfo () {
      const container = this.$refs.container
      const descriptionDiv = document.createElement('div')
      const sysInfo = document.createElement('h3')
      sysInfo.style.color = '#5B8FF9'
      sysInfo.innerHTML = `System Info`
      const description = document.createElement('h4')
      description.innerHTML = this.data.tips
      descriptionDiv.append(sysInfo)
      descriptionDiv.append(description)
      container.appendChild(descriptionDiv)
    },
    handleClickRow (record, index) {
      return {
        on: {
          click: () => {
            if (record.Name) {
              this.$router.push({ path: '/function/listview/' + this.title + '/' + record.Name })
            }
          }
        }
      }
    },
    packageHelp (text) {
      console.info('Name', text)
    },
    mouseEnter (record) {
      this.hover = true
      // this.columnIntro = record.Title
      const textEL = this.$refs[record.Name]
      textEL.style = 'font-size:1' + 'rem;'
    },
    mouseLeave (record) {
      this.hover = false
      // this.columnIntro = ''
      const textEL = this.$refs[record.Name]
      textEL.style.fontSize = 0.9 + 'rem'
    },
    setColumnSlot (columns) {
      if (columns) {
        columns.forEach(column => {
          if (column.dataIndex === 'Name') {
            column.scopedSlots = { customRender: column.dataIndex }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
