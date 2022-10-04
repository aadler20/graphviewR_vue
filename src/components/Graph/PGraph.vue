<template>
  <div id="container" ref="container"/>
</template>

<script>
import G6 from '../../g6'

export default {
  name: 'PGraph',
  props: {
    data: {
      default: null,
      type: Object
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
    }
  },
  watch: {
    data: function (val) {
      val && val.nodes.length > 0 ? this.showGraph() : this.showTips()
    },
    loading: function (value) {
    }
  },
  mounted () {
    this.showTips()
  },
  methods: {
    handlePkgClick (item) {
      const packageName = item.getModel().label
      this.$router.push({ path: '/package/packageInfo/' + packageName })
    },
    showTips () {
      const container = this.$refs.container
      if (container.childNodes[1]) {
        container.removeChild(container.childNodes[1])
      }
      if (container.childNodes[0]) {
        container.removeChild(container.childNodes[0])
      }
      const descriptionDiv = document.createElement('div')
      descriptionDiv.style.fontWeight = 'bold'
      // descriptionDiv.style.fontSize = '1.2rem'
      // descriptionDiv.style.color = '#2E8B57'
      descriptionDiv.innerHTML = 'Please select data for Graph ...'
      container.appendChild(descriptionDiv)
    },
    showGraph () {
      const container = this.$refs.container
      if (container.childNodes[1]) {
        container.removeChild(container.childNodes[1])
      }
      if (container.childNodes[0]) {
        container.removeChild(container.childNodes[0])
      }
      const descriptionDiv = document.createElement('div')
      descriptionDiv.style.fontWeight = 'bold'
      container.appendChild(descriptionDiv)
      const gLayout = this.data.nodes.length < 200 ? 'force' : 'random'
      const graph = new G6.Graph({
        // modes
        modes: {
          default: [
            {
              type: 'zoom-canvas',
              enableOptimize: true,
              optimizeZoom: 0.9
            },
            {
              type: 'drag-canvas',
              enableOptimize: true
            },
            'drag-node'
            // 'brush-select'
          ] // 'drag-canvas'
        },
        // state styles
        nodeStateStyles: {
          highlight: {
            opacity: 1
          },
          dark: {
            opacity: 0.2
          }
        },
        edgeStateStyles: {
          /*
          hover: {
            lineWidth: 5
          },
          click: {
            stroke: 'red'
          } */
          highlight: {
            stroke: '#999'
          }
        },
        container: container,
        // renderer: 'canvas', // or svg default canvas
        width: this.width,
        height: this.height,
        // fitView: true, // if graph fits canvas default false
        // fitViewPadding: [20, 40, 50, 20],
        // ...                      // other options
        layout: {
          type: gLayout, // optional like random fruchterman comboForce ...
          preventOverlap: true, // if overlap allowed
          linkDistance: 100
          // nodeSize: 18 // to calculate if nodes overlap
        },
        animate: false, // Boolean，if using animation as layout changes
        defaultNode: {
          // type: 'circle', // shape of node
          // label: 'node', // default label
          // size: 30, // size of node
          // ... // other options
          // node style
          style: {
            fill: '#E6E6FA',
            stroke: '#228B22',
            lineWidth: 2
          },
          // node label
          labelCfg: {
            // label style
            style: {
              // fill: 'grey', // label color
              fontSize: 12
            }
          }
        },
        defaultEdge: {
          // ... // edge config
          // label: 'edge', // default label
          size: 1,
          style: {
            opacity: 1,
            stroke: '#e2e2e2', // edge color
            lineAppendWidth: 2,
            endArrow: {
              path: G6.Arrow.triangle(3, 10, 5), // width length offset default 0
              d: 5
            }
            // startArrow: {
            //	path: G6.Arrow.vee(15, 20, 15), // width length offset width length offset
            //	d: 15
            // },
          },
          // edge label
          labelCfg: {
            autoRotate: true
          }
        }
      })
      const clearAllStats = () => {
        graph.setAutoPaint(false)
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node)
        })
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge)
        })
        graph.paint()
        graph.setAutoPaint(true)
      }
      const main = async () => {
        graph.data(this.data)
        graph.render()
        // graph.setMode('edit'); // no draggable in edit mode
        // node click listener
        graph.on('node:click', (e) => {
          const { item } = e
          this.handlePkgClick(item)
        })
        graph.on('node:mouseenter', function (e) {
          const item = e.item
          graph.setAutoPaint(false)
          graph.getNodes().forEach(function (node) {
            graph.clearItemStates(node)
            graph.setItemState(node, 'dark', true)
          })
          graph.setItemState(item, 'dark', false)
          graph.setItemState(item, 'highlight', true)
          graph.getEdges().forEach(function (edge) {
            if (edge.getSource() === item) {
              graph.setItemState(edge.getTarget(), 'dark', false)
              graph.setItemState(edge.getTarget(), 'highlight', true)
              graph.setItemState(edge, 'highlight', true)
              edge.toFront()
            } else if (edge.getTarget() === item) {
              graph.setItemState(edge.getSource(), 'dark', false)
              graph.setItemState(edge.getSource(), 'highlight', true)
              graph.setItemState(edge, 'highlight', true)
              edge.toFront()
            } else {
              graph.setItemState(edge, 'highlight', false)
            }
          })
          graph.paint()
          graph.setAutoPaint(true)
        })
        graph.on('node:mouseleave', clearAllStats)
        graph.on('canvas:click', clearAllStats)

        const graphData = graph.save()
        const nodeLen = graphData.nodes.length
        const edgeLen = graphData.edges.length
        descriptionDiv.innerHTML = `${nodeLen} packages with ${edgeLen} dependencies; layout: ${gLayout}`
      }
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
      main()
    }
  }
}
</script>

<style scoped>
</style>
