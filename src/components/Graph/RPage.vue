<template>
  <div id="container" ref="container">
    <div v-if="data.flag!=='INFO404'">
      <div v-html="data"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RPage',
  props: {
    data: {
      default: null,
      type: Array
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
      default: true
    }
  },
  mounted () {
    this.showInfo()
  },
  methods: {
    showInfo () {
      const container = this.$refs.container
      if (this.data.flag && this.data.flag === 'INFO404') {
        const descriptionDiv = document.createElement('div')
        const sysInfo = document.createElement('h3')
        sysInfo.style.color = '#5B8FF9'
        sysInfo.innerHTML = `System Info`
        const description = document.createElement('h4')
        description.innerHTML = this.data.tips
        descriptionDiv.append(sysInfo)
        descriptionDiv.append(description)
        container.appendChild(descriptionDiv)
      }
    }
  }
}
</script>

<style scoped>
a:link {
  background: white;
  color: blue;
}

a:visited {
  background: white;
  color: rgb(50%, 0%, 50%);
}

h1 {
  background: white;
  color: rgb(55%, 55%, 55%);
  font-family: monospace;
  font-size: x-large;
  text-align: center;
}

h2 {
  background: white;
  color: rgb(40%, 40%, 40%);
  font-family: monospace;
  font-size: large;
  text-align: center;
}

h3 {
  background: white;
  color: rgb(40%, 40%, 40%);
  font-family: monospace;
  font-size: large;
}

h4 {
  background: white;
  color: rgb(40%, 40%, 40%);
  font-family: monospace;
  font-style: italic;
  font-size: large;
}

h5 {
  background: white;
  color: rgb(40%, 40%, 40%);
  font-family: monospace;
}

h6 {
  background: white;
  color: rgb(40%, 40%, 40%);
  font-family: monospace;
  font-style: italic;
}

img.toplogo {
  width: 4em;
  vertical-align: middle;
}

img.arrow {
  width: 30px;
  height: 30px;
  border: 0;
}

span.acronym {
  font-size: small;
}

span.env {
  font-family: monospace;
}

span.file {
  font-family: monospace;
}

span.option{
  font-family: monospace;
}

span.pkg {
  font-weight: bold;
}

span.samp{
  font-family: monospace;
}

div.vignettes a:hover {
  background: rgb(85%, 85%, 85%);
}
</style>
