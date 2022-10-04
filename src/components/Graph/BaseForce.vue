<template>
  <div id="container" ref="container"/>
</template>

<script>
import G6 from '../../g6'

export default {
  name: 'BaseForce',
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
    }
  },
  mounted () {
    this.showGraph()
  },
  methods: {
    handlePkgClick (item) {
      const packageName = item.getModel().label
      this.$router.push({ path: '/package/packageInfo/' + packageName })
    },
    showGraph () {
      const container = this.$refs.container
      const descriptionDiv = document.createElement('div')
      descriptionDiv.innerHTML = `rendering, please wait ...`
      container.appendChild(descriptionDiv)
      if (container) {
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
              'drag-node',
              'brush-select'
            ] // 'drag-canvas',
          },
          // states
          // 节点不同状态下的样式集合
          nodeStateStyles: {
            // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
            hover: {
              fill: '#b5b5b5'
            },
            // 鼠标点击节点，即 click 状态为 true 时的样式
            click: {
              stroke: '#000',
              lineWidth: 5
            }
          },
          // 边不同状态下的样式集合
          edgeStateStyles: {
            // 鼠标 hover 上边，即 hover 状态为 true 时的样式
            hover: {
              lineWidth: 5
            }
            // 鼠标点击边，即 click 状态为 true 时的样式
            // click: {
              // stroke: 'red'
            // }
          },
          container: container,
          width: this.width,
          height: this.height,
          fitView: true,
          fitViewPadding: [20, 40, 50, 20],
          // ...                      // 其他配置项
          layout: {
            // Object，可选，布局的方法及其配置项，默认为 random 布局。
            type: 'force', // 指定为力导向布局 // 或者随机布局 random fruchterman comboForce ...
            preventOverlap: true, // 防止节点重叠
            linkDistance: 100, // 指定边距离为100
            nodeSize: 15 // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
          },
          animate: true, // Boolean，可选，全局变化时否使用动画过渡
          defaultNode: {
            // type: 'circle', // 元素的图形
            // label: 'node',
            // size: 30, // 节点大小
            // ...                 // 节点的其他配置
            // 节点样式配置
            style: {
              fill: '#C6E5FF',
              stroke: '#5B8FF9',
              lineWidth: 1
            },
            // 节点上的标签文本配置
            labelCfg: {
              // 节点上的标签文本样式配置
              style: {
                // fill: 'grey', // 节点标签文字颜色
                fontSize: 10 // 标签的样式属性，文字字体大小
              }
            }
          },
          defaultEdge: {
            // ...                 // 边的其他配置
            // label: 'edge',
            // 边样式配置
            style: {
              opacity: 0.6, // 边透明度
              stroke: 'green', // 边描边颜色
              endArrow: {
                path: G6.Arrow.triangle(3, 10, 5), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                d: 5
              }
              // startArrow: {
              //	path: G6.Arrow.vee(15, 20, 15), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
              //	d: 15
              // },
            },
            // 边上的标签文本配置
            labelCfg: {
              autoRotate: true // 边上的标签文本根据边的方向旋转
            }
          }
        })
        const main = async () => {
          // const response = await fetch(
          //  'graph_1.json',
          // );
          // const nodes = this.data[[0]].nodes
          /*
          console.info('nodes', nodes)
          nodes.forEach((node) => {
            console.info('node.style before', node.style)
            if (!node.style) { // true if node.style undefined
              node.style = {}
              node.style.fill = 'grey' // only for test
              console.info('node.style after', node.style)
            }
          })
          const edges = this.data.edges
          console.info('edges', edges)
          edges.forEach((edge) => {
            console.info('edge.style before', edge.style)
            if (!edge.style) {
              edge.style = {}
              edge.style.stroke = 'green'
              console.info('edge.style after', edge.style)
            }
          })
          nodes.forEach((node) => {
            if (!node.style) { // true if node.style undefined
              node.style = {}
            }
            switch (
              node.package // 根据节点数据中的 class 属性配置图形
              ) {
              case 'stats': {
                // node.type = 'circle'; // class = 'c0' 时节点图形为 circle
                node.label = 'st'
                node.style.fill = 'grey'
                break
              }
              case 'astsa': {
                node.type = 'circle' // class = 'c1' 时节点图形为 rect
                // node.size = [15, 15]; // class = 'c1' 时节点大小
                node.style.fill = '#c0c0c0'
                node.label = 'as'
                break
              }
              case 'TSA': {
                node.type = 'circle' // class = 'c2' 时节点图形为 ellipse
                // node.size = [15, 15]; // class = 'c2' 时节点大小
                node.style.fill = 'steelblue'
                node.label = 'ts'
                break
              }
              default: {
                node.type = 'circle'
                node.label = node.package.substr(0, 2)
                node.style.fill = 'steelblue'
              }
            }
          })
          const edges = this.data[[0]].edges
          edges.forEach((edge) => {
            if (!edge.style) {
              edge.style = {}
              console.info('edge.style after', edge.style)
            }
            edge.style.lineWidth = edge.id // 边的粗细映射边数据中的 weight 属性数值
            // 全局定义移到动态配置
            edge.style.opacity = 0.6
            edge.style.stroke = 'green'
          }) */
          graph.data(this.data[[0]])
          // graph.data(this.data)
          graph.render()
          // graph.setMode('edit'); // 进入编辑模式后不能拖拽
          graph.on('node:mouseenter', (e) => {
            const { item } = e
            graph.setItemState(item, 'hover', true)
          })
          graph.on('node:mouseleave', (e) => {
            const { item } = e
            graph.setItemState(item, 'hover', false)
          })
          // 监听鼠标点击节点
          graph.on('node:click', (e) => {
            // 先将所有当前有 click 状态的边的 click 状态置为 false
            const { item } = e
            this.handlePkgClick(item)
          })
          // 监听鼠标进入节点
          graph.on('edge:mouseenter', (e) => {
            const edgeItem = e.item
            // 设置目标节点的 hover 状态 为 true
            graph.setItemState(edgeItem, 'hover', true)
          })
          // 监听鼠标离开节点
          graph.on('edge:mouseleave', (e) => {
            const edgeItem = e.item
            // 设置目标节点的 hover 状态 false
            graph.setItemState(edgeItem, 'hover', false)
          })
          // 监听鼠标点击节点
          graph.on('edge:click', (e) => {
            // 先将所有当前有 click 状态的边的 click 状态置为 false
            const clickEdges = graph.findAllByState('edge', 'click')
            clickEdges.forEach((ce) => {
              graph.setItemState(ce, 'click', false)
            })
            const edgeItem = e.item
            // 设置目标边的 click 状态 为 true
            graph.setItemState(edgeItem, 'click', true)
          })
          const graphData = graph.save()
          const nodeLen = graphData.nodes.length
          const edgeLen = graphData.edges.length
          descriptionDiv.innerHTML = `packages: ${nodeLen}, dependencies: ${edgeLen}`
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
}
</script>

<style scoped>
</style>
