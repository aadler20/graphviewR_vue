<template>
  <div>
    <a-card :loading="loading" :bordered="false" :style="{ marginBottom: '24px' }">
      <r-page :data="htmlData"/>
    </a-card>
  </div>
</template>

<script>
import { getFunctionInfo } from '@/api/function'
import { TagSelect, StandardFormRow, ArticleListContent, RPage } from '@/components'
import IconText from './components/IconText'
const TagSelectOption = TagSelect.Option

export default {
  name: 'ListView',
  components: {
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    ArticleListContent,
    IconText,
    RPage
  },
  data () {
    return {
      functionName: '',
      htmlData: '',
      loading: true,
      loadingMore: false,
      data: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.packageName = this.$route.params.packageName
    this.functionName = this.$route.params.functionName
    this.loadFunctionInfo()
  },
  methods: {
    loadFunctionInfo () {
      return getFunctionInfo({ packageName: this.packageName,
        functionName: this.functionName }).then(res => {
        this.htmlData = res.htmlData
        this.demoData = res.demoData
        // console.info('demoData', this.demoData)
        this.loading = !this.loading
      }).catch(err => {
        console.log('loadFunctionInfo.err', err)
        this.$message.error('Fail to load function info!')
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      this.$http.get('/list/article').then(res => {
        // console.log('res', res)
        this.data = res.result
        this.loading = false
      })
    },
    loadMore () {
      this.loadingMore = true
      this.$http.get('/list/article').then(res => {
        this.data = this.data.concat(res.result)
      }).finally(() => {
        this.loadingMore = false
      })
    },
    setOwner () {
      const { form: { setFieldsValue } } = this
      setFieldsValue({
        owner: ['wzj']
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}
</style>
