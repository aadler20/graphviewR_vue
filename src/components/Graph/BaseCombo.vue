<template>
  <a-card :loading="loading" :bordered="false" :style="{ marginBottom: '24px' }">
    <div id="container" ref="container"/>
  </a-card>
</template>

<script>
import G6 from '../../g6'

const collapseIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y]
  ]
}
const expandIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
    ['M', x - r + r, y - r + 4],
    ['L', x, y + r - 4]
  ]
}

G6.registerCombo(
  'cRect',
  {
    drawShape: function drawShape (cfg, group) {
      const self = this
      // Get the padding from the configuration
      cfg.padding = cfg.padding || [50, 20, 20, 20]
      // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg)
      // Add a rect shape as the keyShape which is the same as the extended rect Combo
      const rect = group.addShape('rect', {
        attrs: {
          ...style,
          x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
          y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
          width: style.width,
          height: style.height
        },
        draggable: true,
        name: 'combo-keyShape'
      })
      // Add the circle on the right
      group.addShape('marker', {
        attrs: {
          ...style,
          fill: '#fff',
          opacity: 1,
          // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
          x: cfg.style.width / 2 + cfg.padding[1],
          y: (cfg.padding[2] - cfg.padding[0]) / 2,
          r: 10,
          symbol: collapseIcon
        },
        draggable: true,
        name: 'combo-marker-shape'
      })
      return rect
    },
    // Define the updating logic of the right circle
    afterUpdate: function afterUpdate (cfg, combo) {
      const group = combo.get('group')
      // Find the circle shape in the graphics group of the Combo by name
      const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape')
      // Update the position of the right circle
      marker.attr({
        // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
        x: cfg.style.width / 2 + cfg.padding[1],
        y: (cfg.padding[2] - cfg.padding[0]) / 2,
        // The property 'collapsed' in the combo data represents the collapsing state of the Combo
        // Update the symbol according to 'collapsed'
        symbol: cfg.collapsed ? expandIcon : collapseIcon
      })
    }
  },
  'rect'
)

export default {
  name: 'BaseCombo',
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
      default: false
    }
  },
  mounted () {
    this.showGraph()
  },
  methods: {
    showGraph () {
      const container = this.$refs.container
      if (container) {
        const graph = new G6.Graph({
          container: container,
          width: this.width,
          height: this.height,
          // fitView: true,
          // fitViewPadding: 50,
          minZoom: 0.00000001,
          layout: {
            // Object，可选，布局的方法及其配置项，默认为 random 布局。
            type: 'force', // 指定为力导向布局 // 或者随机布局 random fruchterman comboForce ...
            preventOverlap: true // 防止节点重叠
            // linkDistance: 100, // 指定边距离为100
            // nodeSize: 15 // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
          },
          // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
          groupByTypes: false,
          // Configure the combos globally
          defaultCombo: {
            // The type of the combos. You can also assign type in the data of combos
            type: 'cRect'
            // ... Other global configurations for combos
          },
          comboStateStyles: {
            dragenter: {
              lineWidth: 4,
              stroke: '#FE9797'
            }
          },
          modes: {
            default: ['drag-combo', 'drag-node', 'drag-canvas', 'click-select', 'zoom-canvas']
          }
        })
        const main = async () => {
          graph.data(this.data[[0]])
          graph.render()
          // collapse/expand when click the marker
          graph.on('combo:click', (e) => {
            if (e.target.get('name') === 'combo-marker-shape') {
              // graph.collapseExpandCombo(e.item.getModel().id);
              graph.collapseExpandCombo(e.item)
              if (graph.get('layout')) graph.layout()
              else graph.refreshPositions()
            }
          })

          graph.on('combo:dragend', (e) => {
            graph.getCombos().forEach((combo) => {
              graph.setItemState(combo, 'dragenter', false)
            })
          })
          graph.on('node:dragend', (e) => {
            graph.getCombos().forEach((combo) => {
              graph.setItemState(combo, 'dragenter', false)
            })
          })

          graph.on('combo:dragenter', (e) => {
            graph.setItemState(e.item, 'dragenter', true)
          })
          graph.on('combo:dragleave', (e) => {
            graph.setItemState(e.item, 'dragenter', false)
          })

          graph.on('combo:mouseenter', (evt) => {
            const { item } = evt
            graph.setItemState(item, 'active', true)
          })

          graph.on('combo:mouseleave', (evt) => {
            const { item } = evt
            graph.setItemState(item, 'active', false)
          })

          if (typeof window !== 'undefined') {
            window.onresize = () => {
              if (!graph || graph.get('destroyed')) return
              if (!container || !container.scrollWidth || !container.scrollHeight) return
              graph.changeSize(container.scrollWidth, container.scrollHeight - 20)
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
</style>
