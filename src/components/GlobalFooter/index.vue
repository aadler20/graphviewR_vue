<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.r-project.org" target="_blank">R Project</a>
      <a href="https://github.com/Aadler20" target="_blank">Github</a>
      <a href="http://www.rosuda.org/" target="_blank">RoSuDa</a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/Aadler20" target="_blank">graphviewR</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
