<template>
  <page-header-wrapper>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="Task List">

      <div slot="extra">
        <div class="extra-item">
          <a-radio-group v-model="status">
            <a-radio-button value="all" @click="checkTask('all')">ALL</a-radio-button>
            <a-radio-button value="todo" @click="checkTask('todo')">To Do</a-radio-button>
            <a-radio-button value="processing" @click="checkTask('processing')">Processing</a-radio-button>
            <a-radio-button value="finished" @click="checkTask('finished')">Finished</a-radio-button>
          </a-radio-group>
        </div>
        <a-range-picker
          :value="[startDate, endDate]"
          :format="dateFormat"
          @change="onChangeRangePicker"
          :style="{width: '256px'}" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="add">New Task</a-button>
      </div>

      <a-table
        ref="taskTable"
        rowKey="id"
        :columns="tblColumns"
        :data-source="taskList"
        :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a @click="edit(record)">Edit</a>
          <a-divider type="vertical" />
          <a-popconfirm title="Are you sure to delete this task?" placement="topRight" @confirm="remove(record)">
            <a>Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import TaskForm from './modules/TaskForm'
import Info from './components/Info'
import { removeTask, listTask, updateTask, saveTask } from '@/api/task'

const tblColumns = [
  // {
    // title: 'Id',
    // dataIndex: 'id',
    // key: 'id',
  // },
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
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'TaskList',
  components: {
    TaskForm,
    Info
  },
  data () {
    return {
      loading: false,
      status: 'all',
      dateFormat: 'YYYY/MM/DD',
      startDate: moment().add(-7, 'days'),
      endDate: moment(),
      tblColumns,
      taskList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.reloadData()
    },
    /**
     * load Task List
     */
     loadTaskList () {
      const param = {
        status: this.status,
        startDate: this.startDate,
        endDate: this.endDate
      }
      return listTask(param).then(res => {
        this.taskList = res.data || []
      }).catch(err => {
        console.log('loadTaskList.err', err)
        this.$message.error('Error on loading task list')
      })
    },
    add () {
      const that = this
      console.log('add')
      this.$dialog(TaskForm,
        // component props
        {
          record: {},
          on: {
            callback (record) {
              saveTask(record).then(res => {
                record.id = res.data.taskId
                that.taskList.push(record)
                that.reloadData()
              }).catch(err => {
                this.$notification['error']({
                  message: 'Error',
                  description: err || 'Error on saving task.',
                  duration: 4
                })
              })
            },
            close () { // close event first then ok or cancel
              console.log('modal close callback')
            },
            ok () {
              console.log('ok callback')
            },
            cancel () {
              console.log('cancel callback')
            }
          }
        },
        // modal props
        {
          title: 'New Task',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    edit (record) {
      const that = this
      console.log('record', record)
      this.$dialog(TaskForm,
        // component props
        {
          record,
          on: {
            callback (record) {
              console.log('callback ', record)
              updateTask(record).then(res => {
                const newRecord = res.data[0]
                for (let i = 0; i < that.taskList.length; i++) {
                  if (that.taskList[i].id === newRecord.id) {
                    Object.assign(that.taskList[i], newRecord)
                    break
                  }
                }
              }).catch(err => {
                that.$notification['error']({
                  message: 'Error',
                  description: err || 'Error on updating task.',
                  duration: 4
                })
              })
            },
            close () {
              console.log('modal close callback')
            },
            ok () {
              console.log('ok callback')
            },
            cancel () {
              console.log('cancel callback')
            }
          }
        },
        // modal props
        {
          title: 'Edit Task',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    remove (record) {
      console.log('remove')
      removeTask({
        id: record.id
      }).then(res => {
        console.log('task removed with id', res.taskId)
        this.taskList = this.taskList.filter(item => item.id !== record.id)
      }).catch(err => {
        this.$notification['error']({
          message: 'error',
          description: err || 'Error on deleting task.',
          duration: 4
        })
      })
    },
    onSearch (value) {
      console.log(value)
    },
    onChangeRangePicker (dates, dateStrings) {
      this.startDate = dates[0]
      this.endDate = dates[1]
      this.reloadData()
    },
    reloadData () {
       this.loadTaskList()
    },
    checkTask (value) {
      this.status = value
      this.reloadData()
    }
  }
}
</script>

<style lang="less" scoped>
.extra-item {
  display: inline-block;
  margin-right: 24px;
}
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
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
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
