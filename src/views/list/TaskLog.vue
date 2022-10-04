<template>
  <page-header-wrapper>
    <div>
      <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
        <div class="salesCard">
          <a-tabs
            default-active-key="1"
            size="large"
            :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
            @change="onChangeTabs">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <div class="extra-item">
                <a-radio-group v-model="timeUnit">
                  <a-radio-button value="hour" @click="setTimeUnit('hour')">Hour</a-radio-button>
                  <a-radio-button value="day" @click="setTimeUnit('day')">Day</a-radio-button>
                  <a-radio-button value="week" @click="setTimeUnit('week')">Week</a-radio-button>
                </a-radio-group>
              </div>
              <a-range-picker
                :value="[startDate, endDate]"
                :format="dateFormat"
                @change="onChangeRangePicker"
                :style="{width: '256px'}" />
            </div>
            <a-tab-pane
              v-for="(item, index) in categories"
              :key="item"
              :loading="index === 0"
              :tab="item">
              <a-row>
                <a-col :xl="18" :lg="12" :md="24" :sm="24" :xs="24">
                  <a-card title="Usage Time Trend">
                    <bar :data="logTrend" :yAlias="yAlias" :startDate="startDate"/>
                  </a-card>
                </a-col>
                <a-col :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list title="Usage Time RankList" :list="rankList"/>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
      <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
        <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
          <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="Log Data" :style="{ height: '100%' }">
              <div slot="extra" style="height: inherit;">
                <!-- style="bottom: 12px;display: inline-block;" -->
                <div class="analysis-salesTypeRadio">
                  <a-radio-group v-model="logPeriod">
                    <a-radio-button value="day" @click="setLogPeriod('day')">24 Hours</a-radio-button>
                    <a-radio-button value="week" @click="setLogPeriod('week')">This Week</a-radio-button>
                    <a-radio-button value="month" @click="setLogPeriod('month')">This Month</a-radio-button>
                  </a-radio-group>
                </div>
              </div>
              <div class="ant-table-wrapper">
                <a-table
                  row-key="index"
                  size="small"
                  :columns="logDataColumns"
                  :dataSource="logList"
                  :pagination="{ pageSize: 8 }"
                />
              </div>
            </a-card>
          </a-col>
          <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="Distribution of hours of work" :style="{ height: '100%' }">
              <div>
                <!-- style="width: calc(100% - 240px);" -->
                <div>
                  <v-chart :force-fit="true" :height="405" :data="logHours" :scale="pieScale">
                    <v-tooltip :showTitle="false" dataKey="item*percent" />
                    <v-axis />
                    <!-- position="right" :offsetX="-140" -->
                    <v-legend dataKey="item" :offsetY="-10"/>
                    <v-pie
                      position="percent"
                      color="item"
                      label="percent"
                      :vStyle="pieStyle" />
                    <v-coord type="theta" :radius="0.9" :innerRadius="0.6" />
                  </v-chart>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import {
  Bar,
  RankList
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { listLog, hoursLog, trendLog } from '@/api/log'

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.00%'
}]

export default {
  name: 'TaskList',
  mixins: [baseMixin],
  components: {
    Bar,
    RankList

  },
  data () {
    return {
      loading: true,
      selected: null,
      selectList: [],
      categories: ['Frequency (time)', 'Proc Time (sec.)'],
      category: 'Frequency (time)',
      yAlias: 'Frequency (time)',
      timeUnit: 'hour',
      logPeriod: 'day',
      dateFormat: 'YYYY/MM/DD',
      startDate: moment().add(-7, 'days'),
      endDate: moment(),
      rankList: [],
      logList: [],
      logHours: [], // in pie chart
      logTrend: [],
      pieScale,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
    logDataColumns () {
      return [
        {
          dataIndex: 'address',
          title: 'Address'
        },
        {
          dataIndex: 'path',
          title: 'Path'
        },
        {
          dataIndex: 'status',
          title: 'Status'
        },
        {
          dataIndex: 'res_date',
          title: 'Date',
          width: 200
        },
        {
          dataIndex: 'proc_time',
          title: 'Proc Time',
          sorter: (a, b) => a.proc_time - b.proc_time,
          scopedSlots: { customRender: 'proc_time' }
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    moment,
    init () {
      this.reloadData()
      this.loading = !this.loading
    },
    loadLogTrend () {
      const param = {
        category: this.category,
        timeUnit: this.timeUnit,
        startDate: this.startDate.toDate(),
        endDate: this.endDate.toDate()
      }
      return trendLog(param).then(res => {
        this.logTrend = res.data || []
        this.rankList = [...res.data].sort(function (a, b) {
          return b.y - a.y
        })
      })
    },
    loadLogList () {
      const param = {
        logPeriod: this.logPeriod
      }
      return listLog(param).then(res => {
        this.logList = res.data || []
      })
    },
    loadLogHours () {
      const param = {
        logPeriod: this.logPeriod
      }
      return hoursLog(param).then(res => {
        this.logHours = res.data || []
      })
    },
    setTimeUnit (type) {
      this.timeUnit = type
      this.reloadData()
    },
    setLogPeriod (type) {
      this.logPeriod = type
      this.reloadData()
    },
    onChangeRangePicker (dates, dateStrings) {
      this.startDate = dates[0]
      this.endDate = dates[1]
      this.reloadData()
    },
    onChangeTabs (category) {
      this.category = category
      this.yAlias = category
      this.reloadData()
    },
    reloadData () {
      this.loadLogTrend()
      this.loadLogList()
      this.loadLogHours()
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
.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
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
.analysis-salesTypeRadio {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
</style>
