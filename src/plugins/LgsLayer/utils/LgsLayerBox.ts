// import ILgsLayerBox from './type'
import { createVNode, render } from 'vue'
import Helper from './helper'
import { ILgsLayer, ILgsLayerConfigs, ILgsLayerMessageConfig, ILgsLayerProps } from '../type'
import LgsLayerConstructor from '../index.vue'
class LgsLayerBox {
  constructor () {
    this.currentId = ''
    this.layers = []
    this.minLayers = []
  }

  defaultOptions: ILgsLayerConfigs = {
    header: {
      text: '',
      showClose: true,
      showMaximize: true,
      showMinimize: true
    },
    teleport: '#app-main',
    time: undefined,
    fixed: true,
    follow: undefined,
    shade: false,
    shadeClose: false,
    btnAlign: 'right',
    opacity: 1,
    id: '',
    anim: 'scaleIn',
    type: 'message',
    layerStyle: '',
    icon: '',
    content: '',
    props: {
      layerId: ''
    },
    resize: false,
    theme: 'darkblue',
    dragOut: true,
    beforeClose: () => Promise.resolve(),
    onSuccess: () => Promise.resolve(),
    onClosed: () => Promise.resolve()
  }

  minLayers:ILgsLayer[]
  currentId:string
  layers:ILgsLayer[]
  open (options:ILgsLayerConfigs&{modelValue?:boolean}):string {
    let maxSeed = Helper.getMaxSeed(this.layers)
    if (maxSeed === undefined) maxSeed = 0
    const id = `lgslayer_${new Date().getTime()}_${maxSeed++}`
    options.id = id
    options.modelValue = true
    Helper.mergeJson<ILgsLayerConfigs>(options.header, this.defaultOptions.header)
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
    vm.props && (vm.props.onActive = () => {
      this.layers.filter(item => item.id !== id)
        .map(item => {
          const proxy = this.getLayerProxy(item.id)
          return proxy && proxy.deActive()
        })
    })
    render(vm, container)
    this.layers.push({ id: id, layer: vm })
    container.firstElementChild && document.body.appendChild(container.firstElementChild)
    return id
  }

  message (options:ILgsLayerMessageConfig):string {
    return this.open({
      type: 'message',
      content: options.message,
      header: {
        text: options.title,
        showMaximize: false,
        showClose: options.showClose || true
      },
      time: options.time
    })
  }

  /**
   * 关闭弹窗
   * @param id 弹窗id
   * @param userCallback 回调函数
   * @returns void
   */
  close (id?:string) {
    if (!id) return
    const layer = this._getLayer(id)
    if (!layer) return
    const component = layer.layer.component

    const instans = component && component.proxy
    instans && instans.close()
    const idx = this._getLayerIndex(id)
    idx !== -1 && this.layers.splice(idx, 1)
  }

  /**
   * 最小化弹窗
   * @param id 弹窗id
   * @param userCallBack 回调函数
   */
  min (id:string, userCallBack:(id:string) => void):void {

  }

  /**
   * 恢复弹窗状态
   * @param id 弹窗id
   * @param userCallBack 回调函数
   */
  restore (id: string, userCallBack:(id:string) => void):void {

  }

  /**
   * 关闭全部弹窗
   */
  closeAll () {
    // this.layers.map(item => {
    //   const proxy = this.getLayerProxy(item.id)
    //   return proxy && proxy.close()
    // })
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const proxy = this.getLayerProxy(this.layers[i].id)
      proxy && proxy.close()
    }
    // let _a
    // for (let i = this.layers.length - 1; i >= 0; i--) {
    //   const instance:any = this.layers[i].layer.vm.component
    //   _a = instance && instance.proxy
    //   _a && _a.close()
    // }
  }

  /**
   * 获取弹窗组件实例
   * @param id 弹窗id
   * @returns 弹窗的组件实例Proxy
   */
  getLayerProxy (id:string) {
    const layerObj = this._getLayer(id)
    const instance:any = layerObj && layerObj.layer.component
    const proxy = instance && instance.proxy
    return proxy
  }

  /**
   * 获取一个弹窗
   * @param id 弹窗id
   * @returns 弹窗信息
   */
  _getLayer (id:string):ILgsLayer|undefined {
    return this.layers.find(item => item.id === id)
  }

  /**
 * 获取弹窗的index
 * @param id 弹窗id
 * @returns 弹窗的index，不存在返回-1
 */
  _getLayerIndex (id:string):number {
    return this.layers.findIndex(item => item.id === id)
  }
}
export default LgsLayerBox
