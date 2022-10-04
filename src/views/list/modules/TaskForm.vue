<template>
  <a-form :form="form">
    <a-form-item
      label="Task Name"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['name', {rules:[{required: true, message: 'Please input task name'}]}]" />
    </a-form-item>
    <a-form-item
      label="Start Time"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD HH:mm"
        v-decorator="['startAt', {rules:[{required: true, message: 'Please choose start time'}]}]"
      />
    </a-form-item>
    <a-form-item
      label="End Time"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD HH:mm"
        v-decorator="['endAt', {rules:[{required: true, message: 'Please choose end time'}]}]"
      />
    </a-form-item>
    <a-form-item
      label="Description"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['description']"></a-textarea>
    </a-form-item>
    <a-form-item
      label="Directory"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['directory']"></a-textarea>
    </a-form-item>
    <a-form-item
      label="Remark"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['remark']"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['id', 'name', 'startAt', 'endAt', 'description', 'directory', 'remark']

export default {
  name: 'TaskForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  methods: {
    onOk () {
      console.log('listen modal ok event')
      const { form: { validateFields } } = this
      return new Promise((resolve, reject) => {
        validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          const param = Object.assign({}, this.record, values)
          this.$emit('callback', param)
          resolve(true)
        })
      })
    },
    onCancel () {
      console.log('listen modal cancel event')
      return new Promise(resolve => {
        resolve(true)
      })
    }
  }
}
</script>
