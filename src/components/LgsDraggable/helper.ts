
import { max } from 'lodash'
import { ILayerInsArr } from './type'
export default class helper {
  /**
   * 点击mask关闭弹窗
   * @param  {[type]} event [description]
   * @param  {[type]} layer [description]
   * @return {[type]}       [description]
   */
  static clickMaskCloseAll (event:any, layer:any, id:any) {
    const mask = event.target.getAttribute('class')
    if (mask && (mask.indexOf('notify-mask') > -1 || mask.indexOf('icon-remove') > -1)) {
      layer.close(id)
    }
  }

  /**
   * 默认的yes按钮操作
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  static btnyes (event:any, options:any, formValue:any) {
    if (typeof (options.yes) === 'function') {
      if (options.type === 6) {
        options.yes(formValue, options.id)
      } else {
        options.yes(options.id)
      }
    } else {
      options.layer.close(options.id)
    }
  }

  /**
   * 默认取消按钮操作
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  static async btncancel (event:any, options:any) {
    if (typeof (options.cancel) === 'function') {
      await options.cancel(options.id)
    } else {
      options.layer.close(options.id)
    }
  }

  /**
   * 隐藏滚动条
   */
  static hiddenScrollBar (options:any) {
    if (!options.scrollbar) {
      const htmlDom = document.getElementsByTagName('html')[0]
      const htmlClass = [...Array.from(htmlDom.classList)]
      if (htmlClass.indexOf('vl-html-scrollbar-hidden') > -1) {
        return
      }

      const htmlWidth = htmlDom.offsetWidth
      // 隐藏滚动条
      // htmlDom.style.overflowY = "hidden";
      htmlDom.classList.add('vl-html-scrollbar-hidden')
      const htmlWidthH = htmlDom.offsetWidth
      htmlDom.style.marginRight = htmlWidthH - htmlWidth + 'px'
    }
  }

  /**
   * 鼠标拖动弹窗
   * @param  {[type]} event   [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  static moveStart (event:any, options:any) {
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

  // /**
  //  * 拖动弹窗
  //  * @param  {[type]} event  [description]
  //  * @param  {[type]} ismove [description]
  //  * @return {[type]}        [description]
  //  */
  // static move (event:any, options:any, ismove:any) {
  //   if (ismove) {
  //     const o = document.getElementById(options.id + '_alert')
  //     o.style.left = options.offset[0] + (event.clientX - this.moveLeft) + 'px'
  //     o.style.top = options.offset[1] + (event.clientY - this.moveTop) + 'px'
  //   }
  // }

  /**
   * [sleep description]
   * @param  {[type]} ms [description]
   * @return {[type]}    [description]
   */
  static sleep (ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   *  深度拷贝
   * @param {*} source
   */
  static deepClone (target:any) {
    const copyedObjs:any[] = [] // 此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
    function _deepCopy (target:any) {
      if ((typeof target !== 'object') || !target) {
        return target
      }
      for (let i = 0; i < copyedObjs.length; i++) {
        if (copyedObjs[i].target === target) {
          return copyedObjs[i].copyTarget
        }
      }
      let obj:any|any[] = {}
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
  static evenNumber (str:string|number) {
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

  static mergeJson =(options:any, def:any) => {
    for (const key in def) {
      if (options[key] === undefined) {
        options[key] = def[key]
      }
    }
    return options
  }

  static getMaxSeed=(arr:ILayerInsArr[]) => {
    const newArr:number[] = arr.map(item => {
      return parseInt(item.id.split('_')[2])
    })
    return max(newArr)
  }
}
