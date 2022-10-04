<template>
  <a-upload-dragger
    :name="name"
    :multiple="true"
    :file-list.sync="value"
    :remove="handleRemove"
    :before-upload="beforeUpload"
    @preview="handlePreview"
    @download="handleDownload"
  >
    <slot>
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Click or drag file here
      </p>
    </slot>
  </a-upload-dragger>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      require: true,
      default: () => []
    },
    name: {
      type: String,
      default: 'file'
    }
  },
  methods: {
    handleRemove (file) {
      const that = this
      return new Promise((resolve, reject) => {
        this.$confirm({
          title: 'Are you sure to delete this file?',
          onOk () {
            return new Promise((resolve, reject) => {
              const index = that.value.indexOf(file)
              const newFileList = that.value.slice()
              newFileList.splice(index, 1)
              that.$emit('remove', {
                files: newFileList,
                index: index,
                delFile: file
              })
              resolve()
            })
          },
          onCancel () {
            resolve(false)
          }
        })
      })
    },
    beforeUpload (file) {
      this.$emit('add', file)
      return false
    },
    handlePreview (file) {
      this.$emit('preview', file)
    },
    handleDownload (file) {
      this.$emit('download', file)
    }
  }
}
</script>

<style scoped>

</style>
