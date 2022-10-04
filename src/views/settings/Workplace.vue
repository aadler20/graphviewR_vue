<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>graphviewR</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="Installed Packages" :value="installedPackages" />
        </div>
        <div class="stat-item">
          <a-statistic title="API calls weekly" :value="apiCalls" />
        </div>
        <div class="stat-item">
          <a-statistic title="Active Tasks" :value="activeTasks"/>
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="Active Tasks"
            :body-style="{ padding: 0 }"
          >
            <a-table
              ref="taskTable"
              rowKey="id"
              :columns="tblColumns"
              :data-source="taskList"
              :pagination="{ pageSize: 6 }"
              :loading="loading"/>
          </a-card>

          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="Usage Time Trend"
            :body-style="{ padding: 0 }"
          >
            <div slot="extra">
              <div class="extra-item">
                <a-radio-group v-model="timeUnit">
                  <a-radio-button value="day" @click="setTimeUnit('day')">Day</a-radio-button>
                  <a-radio-button value="hour" @click="setTimeUnit('hour')">Hour</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <bar :data="logTrend" :yAlias="yAlias" :startDate="startDate"/>
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
            title="Navigation"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a @click="toTableView()">Table View</a>
              <a @click="toGraphView()">Graph View</a>
              <a @click="toTaskList()">My Task</a>
              <a @click="toTaskLog()">My Log</a>
              <a @click="toREditor()">R Editor</a>
              <a @click="toLearning()">Learning</a>
            </div>
          </a-card>
          <a-card
            title="Packages"
            style="margin-bottom: 24px"
            :loading="loading"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div slot="extra">
              <div class="extra-item">
                <a-radio-group v-model="priority">
                  <a-radio-button value="all" @click="setPriority('all')">ALL</a-radio-button>
                  <a-radio-button value="high" @click="setPriority('high')">High</a-radio-button>
                  <a-radio-button value="base" @click="setPriority('base')">Base</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <a-table
              ref="table"
              :columns="tblColumns1"
              :data-source="packageList"
              :pagination="{ pageSize: 6 }"
              :loading="loading"/>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Bar } from '@/components'

import { listTask } from '@/api/task'
import { trendLog } from '@/api/log'
import { getPackageSimple } from '@/api/package'

const tblColumns = [
  {
    title: 'Task Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Start Time',
    dataIndex: 'startAt',
    key: 'startAt',
    sorter: (a, b) => new Date(a.startAt) - new Date(b.startAt),
    scopedSlots: { customRender: 'startAt' }
  },
  {
    title: 'End Time',
    dataIndex: 'endAt',
    key: 'endAt',
    sorter: (a, b) => Date.parse(a.endAt) - Date.parse(b.endAt),
    scopedSlots: { customRender: 'endAt' }
  },
  {
    title: 'Directory',
    dataIndex: 'directory',
    key: 'directory'
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark'
  }
]

const tblColumns1 = [
  {
    title: 'Package',
    dataIndex: 'Package',
    key: 'Package'
  },
  {
    title: 'Version',
    dataIndex: 'Version',
    key: 'Version'
  },
  {
    title: 'Depends',
    dataIndex: 'Depends',
    key: 'Depends'
  }
]

export default {
  name: 'Workplace',
  components: {
    Bar,
    PageHeaderWrapper
  },
  data () {
    return {
      // statistics
      activeTasks: 0,
      totalTasks: 0,
      apiCalls: 0,
      installedPackages: 0,
      timeFix: timeFix(),
      avatar: '',
      user: {},
      dateFormat: 'YYYY/MM/DD',
      startDate: moment().add(-7, 'days'),
      endDate: moment(),
      // task card
      tblColumns,
      taskList: [],
      // log card
      category: 'Frequency (time)',
      yAlias: 'Frequency (time)',
      timeUnit: 'day',
      logTrend: [],
      loading: false,
      // package card
      tblColumns1,
      packageList: [],
      priority: 'all'
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.username,
      welcome: state => state.user.welcome
    }),
    currentUser () {
      return {
        name: this.user.name,
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.init()
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  methods: {
    init () {
      console.info('init in settings')
      this.reloadData()
    },
    toTableView () {
      this.$router.push({ path: '/package/tableview' })
    },
    toGraphView () {
      this.$router.push({ path: '/package/graphview' })
    },
    toTaskList () {
      this.$router.push({ path: '/task/task-list' })
    },
    toTaskLog () {
      this.$router.push({ path: '/task/task-log' })
    },
    toREditor () {
      this.$router.push({ path: '/editor' })
    },
    toLearning () {
      this.$router.push({ path: '#' })
    },
    loadTaskList () {
      const param = {
        status: 'processing',
        startDate: this.startDate,
        endDate: this.endDate
      }
      return listTask(param).then(res => {
        console.info('res in listTask', res)
        this.taskList = res.data || []
        this.activeTasks = this.taskList.length
      }).catch(err => {
        console.log('loadTaskList.err', err)
        this.$message.error('Error on loading task list')
      })
    },
    setTimeUnit (type) {
      this.timeUnit = type
      this.loadLogTrend()
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
        this.apiCalls = res.apiCalls
      })
    },
    checkTask (status) {
      this.status = status
      this.loadTaskList()
    },
    loadPackageTable () {
      return new Promise((resolve, reject) => {
          getPackageSimple({ priority: this.priority }).then(res => {
            this.packageList = res.data || []
            if (this.priority === 'all') {
              this.installedPackages = this.packageList.length
            }
            resolve(true)
          }).catch(err => {
            console.log('loadLocalPackages.err', err)
            this.$message.error('Fail to load local packages!')
            reject(err)
          })
        }
      )
    },
    reloadData () {
      this.loadTaskList()
      this.loadLogTrend()
      this.loadPackageTable()
    },
    setPriority (priority) {
      this.priority = priority
      this.loadPackageTable()
    }
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

.project-list {
  .card-title {
    font-size: 0;

    a {
      // color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      // color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    // color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      // color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
