<template>
  <div class="my-editor">
    <div class="container" id="container" ref="container"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main'

export default {
  props: {
    code: {
      type: String,
      default: '# R Editor'
    },
    refresh: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: function () {
        return 'vs-dark'
      }
    },
    minimap: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    language: {
      type: String,
      default: function () {
        return 'r'
      }
    },
    editorOptions: {
      type: Object,
      default: function () {
        return {
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          codeLens: true,
          // 代码可分小段折叠
          foldingStrategy: 'indentation',
          selectOnLineNumbers: true,
          roundedSelection: false,
          // 只读
          readOnly: false,
          // 光标样式
          cursorStyle: 'line',
          // 自动布局
          automaticLayout: true,
          // 字形边缘
          glyphMargin: true,
          useTabStops: false,
          // 字体大小
          fontSize: 28,
          // tab 缩进长度
          tabSize: 2,
          // 自动缩进
          autoIndent: true
          // forceMoveMarkers: true
        }
      }
    }
  },
  watch: {
    theme (value1, value2) {
      monaco.editor.setTheme(value1)
    },
    // value1: new value; value2: old value
    code (value1, value2) {
      if (this.refresh) {
        this.monacoEditor.dispose()
      }
      this.initEditor()
    }
  },
  data () {
    return {
      lastPosition: null
    }
  },
  mounted () {
    if (this.code) {
      this.initEditor()
    }
  },
  methods: {
    changeValue (codeValue) {
      console.info('value to change', codeValue)
      this.monacoEditor.setCode(codeValue)
      const position = this.monacoEditor.getPosition()
      console.info('position in changeValue', position)
    },
    handleInput (currentCode) {
      const that = this
      return new Promise((resolve, reject) => {
        console.info('currentCode in handleInput', currentCode)
        that.$emit('codeInput', { currentCode })
        resolve()
      })
    },
    initEditor () {
      const modesIds = monaco.languages.getLanguages().map(function (lang) { return lang.id })
      console.info('editor languages', modesIds)
      this.monacoEditor = monaco.editor.create(this.$refs.container, {
        value: this.code,
        language: this.language,
        theme: this.theme,
        minimap: { enabled: this.minimap },
        scrollbar: {
          // vertical: 'hidden',
          // horizontal: 'hidden',
          handleMouseWheel: false
        },
        editorOptions: this.editorOptions
      })
      this.$emit('onMounted', this.monacoEditor)
      this.monacoEditor.onDidChangeCursorPosition(e => {
        console.log('Cursor changed', this.monacoEditor.getPosition())
        // const startLineNumber = this.monacoEditor.getPosition().lineNumber
        // console.log('startLineNumber', startLineNumber)
        // const startColumn = this.monacoEditor.getPosition().column
        // console.log('startColumnNumber', startColumn)
        // const endLineNumber = this.monacoEditor.getPosition().lineNumber
        // console.log('endLineNumber', endLineNumber)
        // const endColumn = this.monacoEditor.getPosition().column
        // console.log('endColumn', endColumn)
        // this.monacoEditor.setPosition(position)
      })
      this.monacoEditor.onDidChangeModelContent((event) => {
        const pos = this.monacoEditor.getPosition()
        console.info('position', pos)
        const currentCode = this.monacoEditor.getValue()
        console.info('currentCode', currentCode)
        this.handleInput(currentCode)
      })
      this.monacoEditor.onMouseDown((e) => {
        if (e.target.type === 6 || e.target.type === 7) {
          this.lastPosition = this.monacoEditor.getPosition()
        }
      })
      this.monacoEditor.onKeyDown(function (e) {
        console.info('keyDown event', e)
        if (e.ctrlKey && e.keyCode === monaco.KeyCode.KEY_S) {
          e.preventDefault()
        }
      })
      this.monacoEditor.onKeyUp(function (e) {
        console.info('keyUp event', e)
        if (e.ctrlKey && e.keyCode === monaco.KeyCode.KEY_S) {
          e.preventDefault()
        }
      })
      this.monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
        console.log('Ctrl + S pressed!')
      })
      // this.monacoEditor.trigger('keyboard', 'type', {text: 'value'})
      // this.monacoEditor.focus()
      // const position  = this.monacoEditor.getPosition()
      // this.monacoEditor.setPosition(position)
    }
  },
  beforeDestroy () {
    this.monacoEditor && this.monacoEditor.dispose()
  }
}
</script>

<style lang="less" scoped>
.my-editor {
  .container {
    height: 400px;
    text-align: left;
  }
}
</style>
