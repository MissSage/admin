// import ILayerBox from './type'
import { createVNode, render } from 'vue'
import Helper from './helper'
import { ILayerInsArr, ILgsLayerConfigs, ILgsLayerProps } from '../type'
import LgsLayerConstructor from '../index.vue'
class LgsLayerBox {
  constructor () {
    this.currentId = ''
    this.layers = []
  }

  defaultOptions: ILgsLayerConfigs = {
    title: {
      text: '弹窗',
      btns: [{
        text: '按钮1',
        disabled: true,
        click: () => Promise.resolve(),
        type: 'default'
      }]
    },
    onSuccess: () => Promise.resolve(console.log('success')),
    onEnd: () => Promise.resolve(console.log('end')),
    teleport: 'body',
    time: undefined,
    fullscreen: false,
    position: 'b',
    fixed: true,
    follow: undefined,
    maximize: false,
    shade: false,
    shadeClose: false,
    btns: [],
    opacity: 1,
    id: '',
    anim: 'scaleIn',
    type: 'message',
    layerStyle: '',
    icon: '',
    content: '',
    resize: false,
    theme: '',
    beforeClose: () => {},
    close: {
      show: true,
      postion: 'right',
      color: 'white',
      click: () => {}
    },
    dragOut: true
  }

  currentId:string
  layers:ILayerInsArr[]
  open (options:any) {
    let maxSeed = Helper.getMaxSeed(this.layers)
    if (maxSeed === undefined) maxSeed = 0
    const id = `lgslayer_${new Date().getTime()}_${maxSeed++}`
    options.id = id
    options.modelValue = true
    const configs:ILgsLayerConfigs = Helper.mergeJson<ILgsLayerConfigs>(options, this.defaultOptions)
    const props:ILgsLayerProps = {
      modelValue: options.modelValue,
      config: configs
    }
    const container = document.createElement('div')
    container.className = `${id}_container`
    // 创建虚拟节点
    const vm = createVNode(
      LgsLayerConstructor,
      props
    )
    vm.props && (vm.props.onDestroy = () => {
      render(null, container)
    })
    render(vm, container)
    this.layers.push({ id: id, layer: vm })
    container.firstElementChild && document.body.appendChild(container.firstElementChild)
    return id
  }

  close (id:string, userCallback:(id:string)=>void) {
    const idx = this.layers.findIndex(item => item.id === id)
    const layer = this.layers[idx]
    if (!layer) return
    const instans = layer.layer.component && layer.layer.component.proxy
    instans && instans.close()
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
