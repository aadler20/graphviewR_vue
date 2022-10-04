<template>
  <div id="container" ref="container"/>
</template>

<script>
import G6 from '../../g6'

const colors = [
  '#BDD2FD',
  '#BDEFDB',
  '#C2C8D5',
  '#FBE5A2',
  '#F6C3B7',
  '#B6E3F5',
  '#D3C6EA',
  '#FFD8B8',
  '#AAD8D8',
  '#FFD6E7'
]
const strokes = [
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#E8684A',
  '#6DC8EC',
  '#9270CA',
  '#FF9D4D',
  '#269A99',
  '#FF99C3'
]

export default {
  name: 'FGraph',
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
      default: true
    }
  },
  watch: {
    data: function (val) {
      if (val && val.packages.length > 0) {
        val.nodes.length > 0 ? this.showGraph() : this.showTips()
      }
    }
  },
  mounted () {
    const container = this.$refs.container
    const descriptionDiv = document.createElement('div')
    descriptionDiv.style.fontWeight = 'bold'
    descriptionDiv.style.fontSize = '1.2rem'
    descriptionDiv.style.color = '#2E8B57'
    descriptionDiv.innerHTML = `Loading data now, please wait just a moment ...`
    container.appendChild(descriptionDiv)
    const nodeLen = this.data.nodes.length
    if (nodeLen > 0) {
      this.showGraph()
    }
  },
  methods: {
    handlePkgClick (item) {
      const functionName = item.getModel().id
      const packageName = item.getModel().package
      this.$router.push({ path: '/function/listview/' + packageName + '/' + functionName })
    },
    showTips () {
      const container = this.$refs.container
      while (container.firstChild) {
        container.firstChild.remove()
      }
      const thisPackage = this.data.packages[0]
      const descriptionDiv = document.createElement('div')
      descriptionDiv.style.fontWeight = 'bold'
      descriptionDiv.innerHTML = `No Function is defined in ${thisPackage} Package. It might contain various datasets.`
      container.appendChild(descriptionDiv)
    },
    showGraph () {
      const container = this.$refs.container
      while (container.firstChild) {
        container.firstChild.remove()
      }
      const descriptionDiv = document.createElement('div')
      descriptionDiv.style.fontWeight = 'bold'
      container.appendChild(descriptionDiv)
      const packageMap = new Map()
      let packageId = 0
      this.data.nodes.forEach(node => {
        // package
        if (node.package && packageMap.get(node.package) === undefined) {
          packageMap.set(node.package, packageId)
          packageId++
        }
        const cid = packageMap.get(node.package)
        if (!node.style) {
          node.style = {}
        }
        node.style.fill = colors[cid % colors.length]
        node.style.stroke = strokes[cid % strokes.length]
      })
      // layout
      const gLayout = this.data.nodes.length < 200 ? 'force' : 'random'
      const legendFunctions = {}
      const legNodes = []
      this.data.packages.forEach(pkg => {
        legendFunctions[pkg] = (d) => {
          if (d.package === pkg) return true
          return false
        }
        legNodes.push({
          'id': pkg,
          'label': pkg
        })
      })
      const legendData = { 'nodes': legNodes }
      legendData.nodes.forEach(node => {
        const cid = packageMap.get(node.id)
        node.size = 14
        node.style = {
          fill: colors[cid % colors.length],
          stroke: strokes[cid % strokes.length],
          lineWidth: 1
        }
      })
      const legend = new G6.Legend({
        data: legendData,
        align: 'center',
        layout: 'horizontal', // vertical
        position: 'top',
        vertiSep: 24, // vertical distance
        horiSep: 24, // horizontal distance
        offsetY: -12,
        padding: [4, 16, 8, 16],
        containerStyle: {
          fill: '#ccc',
          lineWidth: 1
        },
        title: 'Legend',
        titleConfig: {
          position: 'left',
          offsetX: 0,
          offsetY: 12,
          style: {
            fontSize: 16
          }
        },
        filter: {
          enable: true,
          multiple: true,
          trigger: 'click',
          graphActiveState: 'activeByLegend',
          graphInactiveState: 'inactiveByLegend',
          filterFunctions: legendFunctions
        }
      })
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
        plugins: [legend],
        // state styles
        nodeStateStyles: {
          highlight: {
            opacity: 1
          },
          dark: {
            opacity: 0.2
          },
          activeByLegend: {
            lineWidth: 5,
            strokeOpacity: 0.5,
            stroke: '#f00'
          },
          inactiveByLegend: {
            opacity: 0.5
          }
        },
        edgeStateStyles: {
          /*
          activeByLegend: {
            lineWidth: 10,
            strokeOpacity: 0.5
          },
          inactiveByLegend: {
            opacity: 0.5
          } */
          highlight: {
            stroke: '#999'
          }
        },
        container: container,
        // renderer: 'canvas', // or svg default canvas
        width: this.width,
        height: this.height,
        // fitView: false, // if graph fits canvas default false
        // fitViewPadding: [20, 40, 50, 20],
        // ...                      // other options
        layout: {
          type: gLayout, // optional like random fruchterman comboForce ...
          preventOverlap: true, // if overlap allowed
          linkDistance: 100
          // nodeSize: 18 // to calculate if nodes overlap
        },
        animate: false, // Boolean，if use animation as layout changes
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
        // node click listener
        graph.on('node:click', (e) => {
          const { item } = e
          this.handlePkgClick(item)
        })
        const graphData = graph.save()
        const nodeLen = graphData.nodes.length
        const edgeLen = graphData.edges.length
        descriptionDiv.innerHTML = `${nodeLen} functions with ${edgeLen} dependencies; layout: ${gLayout}`
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
#legendContainer{
  position: absolute;
  bottom: 12px;
  left: 8px;
  width: 100px;
  height: 100px;
}
</style>
