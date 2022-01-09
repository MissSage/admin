// import ILayerBox from './type'
import { createVNode, render } from 'vue'
import Helper from './helper'
import { ILayerInsArr } from '../type'
import LgsLayerConstructor from '../index.vue'
class LgsLayerBox {
  constructor () {
    this.currentId = ''
    this.layers = []
  }

  currentId:string
  layers:ILayerInsArr[]
  open (options:any) {
    let maxSeed = Helper.getMaxSeed(this.layers)
    if (maxSeed === undefined) maxSeed = 0
    const id = `lgslayer_${new Date().getTime()}_${maxSeed++}`
    options.id = id
    options.modelValue = true
    const container = document.createElement('div')
    container.className = `${id}_container`
    // 创建虚拟节点
    const vm = createVNode(
      LgsLayerConstructor,
      options
    )
    vm.props && (vm.props.onDestroy = () => {
      render(null, container)
    })
    render(vm, container)
    this.layers.push({ id: id, layer: vm })
    container.firstElementChild && document.body.appendChild(container.firstElementChild)
  }

  close (id:string, userCallback:(id:string)=>void) {
    const idx = this.layers.findIndex(item => item.id === id)
    const layer = this.layers[idx]
    layer && layer.layer.close().then(() => {
      userCallback(layer.id)
    })
    this.layers.splice(idx, 1)
  }

  closeAll () {
    let _a
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const instance:any = this.layers[i].layer.vm.component
      _a = instance && instance.proxy
      _a && _a.close()
    }
  }
}
export default LgsLayerBox
