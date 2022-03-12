
import { max } from 'lodash-es'
import { IFollowTarget, ILgsLayer, IRectInfo } from '../type'
export default class helper {
  /**
   * 鼠标拖动弹窗
   * @param  {[type]} event   [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  static moveStart (event: any, options: any) {
    options.offset = options.offset === 'auto' ? [] : options.offset
    const dom = document.getElementById(options.id + '')
    if (!dom) return
    if (options.offset.length === 0) {
      options.offset.push(dom.offsetLeft)
      options.offset.push(dom.offsetTop)
      options.offset.push(0)
    }
    if (options.offset.length === 2) {
      options.offset.push(0)
    }
    options.offset[0] = (dom.offsetLeft)
    options.offset[1] = (dom.offsetTop)
  }

  /**
   * [sleep description]
   * @param  {[type]} ms [description]
   * @return {[type]}    [description]
   */
  static sleep (ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   *  深度拷贝
   * @param {*} source
   */
  static deepClone (target: any) {
    const copyedObjs: any[] = [] // 此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
    function _deepCopy (target: any) {
      if ((typeof target !== 'object') || !target) {
        return target
      }
      for (let i = 0; i < copyedObjs.length; i++) {
        if (copyedObjs[i].target === target) {
          return copyedObjs[i].copyTarget
        }
      }
      let obj: any | any[] = {}
      if (Array.isArray(target)) {
        obj = [] // 处理target是数组的情况
      }
      copyedObjs.push({
        target: target,
        copyTarget: obj
      })
      Object.keys(target).forEach(key => {
        if (obj[key]) {
          return
        }
        obj[key] = _deepCopy(target[key])
      })
      return obj
    }
    return _deepCopy(target)
  }

  /**
   *  取偶数
   * @param {*} str
   */
  static evenNumber (str: string | number) {
    !str && (str = '')
    str = str.toString()
    const result = str.match(/\d+/g)
    if (result) {
      const n = parseInt(result[0])
      if (n % 2 === 0) {
        return str
      } else {
        str = str.replace(n.toString(), (n + 1).toString())
        return str
      }
    } else {
      return str
    }
  }

  static mergeJson<T> (options: any, def: any) {
    if (!options) options = {}
    for (const key in def) {
      if (options[key] === undefined) {
        options[key] = def[key]
      }
    }
    return options as T
  }

  static getMaxSeed = (arr: ILgsLayer[]) => {
    const newArr: number[] = arr.map(item => {
      return parseInt(item.id.split('_')[2])
    })
    return max(newArr)
  }

  static client = (type: 'width'|'height', dom?:HTMLElement|string, percent?:number) => {
    let value = 0
    if (dom) {
      dom = typeof dom === 'string' ? document.querySelector(dom) as HTMLElement : dom
    } else {
      dom = document.body
    }

    switch (type) {
      case 'width':
        value = dom ? dom.clientWidth : 0
        break
      case 'height':
        value = dom ? dom.clientHeight : 0
        break
      default:
        break
    }
    return percent ? value * percent / 100 : value
  }

  static offset = (type: 'width'|'height', dom?:HTMLElement|string) => {
    let value = 0
    if (dom) {
      dom = typeof dom === 'string' ? document.querySelector(dom) as HTMLElement : dom
    } else {
      dom = document.body
    }

    switch (type) {
      case 'width':
        value = dom ? dom.offsetWidth : 0
        break
      case 'height':
        value = dom ? dom.offsetHeight : 0
        break
      default:
        break
    }
    return value
  }

  static scroll = (type: 'left'|'top'|'width'|'height', dom?:HTMLElement|string) => {
    if (dom) {
      dom = typeof dom === 'string' ? document.querySelector(dom) as HTMLElement : dom
    } else {
      dom = document.body
    }
    switch (type) {
      case 'left':
        return dom.scrollLeft
      case 'top':
        return dom.scrollTop
      case 'width':
        return dom.scrollWidth
      case 'height':
        return dom.scrollHeight
      default:
        return 0
    }
  }

  /**
 * 获取跟随的元素的Rect信息
 * @param follow 跟随的元素 #id 或 .class 或 [e.clientX, e.clientY]
 * @param w w
 * @param h h
 * @returns [左，上，右，下，css类名]
 */
  static getFollowRect = (follow?: IFollowTarget, teleport?:string, w?: number, h?: number): IRectInfo => {
    let t: number = 0
    let l: number = 0
    w = w || 0
    h = h || 0
    let r: number = 0
    let b: number = 0
    if (typeof follow === 'object') {
      //
      return [follow[0], follow[1], follow[0] + w, follow[1] + h, w, h, '']
    } else {
      const obj: HTMLElement | null = document.querySelector(follow || '')
      const tel:HTMLElement | null = document.querySelector(teleport || '')
      if (obj) {
        t = obj.offsetTop // 获取该元素对应父容器的上边距
        l = obj.offsetLeft // 对应父容器的上边距
        // 判断是否有父容器，如果存在则累加其边距
        if (obj.offsetParent) { // 等效 obj = obj.offsetParent;while (obj != undefined)
          const offsetParent = obj.offsetParent as HTMLElement
          t += offsetParent.offsetTop // 叠加父容器的上边距
          l += offsetParent.offsetLeft // 叠加父容器的左边距
        }
        if (tel) {
          let telofL = tel.offsetLeft
          let telofT = tel.offsetTop
          if (tel.offsetParent) {
            telofL = telofL + (tel.offsetParent as HTMLElement).offsetLeft
            telofT = telofT + (tel.offsetParent as HTMLElement).offsetTop
          }
          l = l - telofL
          t = t - telofT
        }
        r = l + obj.offsetWidth
        b = t + obj.offsetHeight
        w = obj.offsetWidth
        h = obj.offsetHeight
      }
      return [l, t, r, b, w, h, '']
    }
  }

  /**
   * 全屏切换
   */
  static toggleFullScreen (el?:HTMLElement) {
    if (!document.fullscreenElement) {
      if (el) {
        el.requestFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
      return true
    } else {
      document.exitFullscreen()
      return false
    }
  }

  /**
   *
   * @param el 元素
   * @param styleProp 样式属性
   * @returns 返回
   */
  static getStyle (el:any, styleProp:any) {
    const dom = document.getElementById(el)
    let value:string = '0'
    if (document.defaultView && dom) {
      value = document.defaultView
        .getComputedStyle(dom, null)
        .getPropertyValue(styleProp)
    }
    return value
  }
}
