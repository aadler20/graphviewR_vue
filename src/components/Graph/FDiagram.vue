<template>
  <div id="container" ref="container"/>
</template>

<script>
import G6 from '../../g6'

const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  fixToNode: [1, 0.5],
  // the types of items that allow the tooltip show up
  itemTypes: ['node'],
  // custom the tooltip's content
  getContent: (e) => {
    const outDiv = document.createElement('div')
    outDiv.style.maxWidth = '320px'
    outDiv.style.height = 'fit-content'
    outDiv.style.fontSize = '1rem'
    const model = e.item.getModel()
    outDiv.innerHTML = `${model.desc}`
    return outDiv
  }
})

export default {
  name: 'FDiagram',
  props: {
    data: {
      default: null,
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    name: {
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
    this.showGraph()
  },
  methods: {
    showGraph () {
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
      } else {
        const graph = new G6.TreeGraph({
          container: 'container',
          width: this.width,
          height: this.height,
          plugins: [tooltip],
          modes: {
            default: [
              {
                type: 'collapse-expand',
                onChange: function onChange (item, collapsed) {
                  const data = item.get('model')
                  data.collapsed = collapsed
                  return true
                }
              },
              'drag-node',
              'drag-canvas',
              'zoom-canvas'
            ]
          },
          defaultNode: {
            size: 26,
            style: {
              fill: '#E6E6FA',
              lineWidth: 1
            },
            anchorPoints: [
              [0, 0.5],
              [1, 0.5]
            ]
          },
          defaultEdge: {
            type: 'cubic-horizontal'
          },
          layout: {
            type: 'mindmap',
            direction: 'H',
            getHeight: () => {
              return 16
            },
            getWidth: () => {
              return 16
            },
            getVGap: () => {
              return 10
            },
            getHGap: () => {
              return 50
            },
            getSide: (d) => {
              if (d.id === 'arguments') {
                return 'left'
              }
              return 'right'
            }
          },
          // 节点不同状态下的样式集合
          nodeStateStyles: {
            // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
            hover: {
              fill: '#228B22'
            },
            leave: {
              fill: '#E6E6FA'
            }
          }
        })
        const main = async () => {
          const cid = this.data.id
          let centerX = 0
          graph.node(function (node) {
            if (node.id === cid) {
              centerX = node.x
            }

            return {
              label: node.id,
              labelCfg: {
                position:
                  node.children && node.children.length > 0
                    ? 'left'
                    : node.x > centerX
                    ? 'right'
                    : 'left',
                offset: 5
              }
            }
          })
          graph.data(this.data)
          graph.render()
          graph.fitView()
          // 监听鼠标进入节点
          graph.on('node:mouseenter', (e) => {
            const { item } = e
            graph.setItemState(item, 'hover', true)
          })
          graph.on('node:mouseleave', (e) => {
            const { item } = e
            graph.setItemState(item, 'hover', false)
          })
          if (typeof window !== 'undefined') {
            window.onresize = () => {
              if (!graph || graph.get('destroyed')) return
              if (!container || !container.scrollWidth || !container.scrollHeight) return
              graph.changeSize(container.scrollWidth, container.scrollHeight)
            }
          }
        }
        main()
      }
    }
  }
}
</script>

<style scoped>
.g6-component-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #000;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>
