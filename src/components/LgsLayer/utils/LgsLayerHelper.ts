import { LgsLayerDefOptions } from '..'

class LayerHelper {
  /**
   * 点击mask关闭弹窗
   * @param  {[MouseEvent]} event [description]
   * @param  {[type]} layer [description]
   * @return {[void]}       [description]
   */
  static maskClose (event:MouseEvent, layer:any, id:string) {
    const mask = event && event.target && (event.target as HTMLElement).getAttribute('class')
    if (mask && (mask.indexOf('notify-mask') > -1 || mask.indexOf('icon-remove') > -1)) {
      layer.close(id)
    }
  }

  /**
   * 默认的yes按钮操作
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  static btnyes (event:MouseEvent, options:any, formValue:any) {
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
      const htmlClass = Array.from(htmlDom.classList)
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
  static moveStart (event:MouseEvent, options:LgsLayerDefOptions) {
    options.offset = (!options.offset) || options.offset === 'auto' ? [500, 500, 0] : options.offset
    // if (options.offset.length === 0) {
    //   options.offset.push(document.getElementById(options.id + '')?.offsetLeft)
    //   options.offset.push(document.getElementById(options.id + '')?.offsetTop)
    //   options.offset.push(0)
    // }
    // if (options.offset.length === 2) {
    //   options.offset.push(0)
    // }
    const dom = document.getElementById(options.id + '')
    options.offset[0] = dom ? dom.offsetLeft : 500
    options.offset[1] = dom ? dom.offsetTop : 500
  }

  /**
   * [sleep description]
   * @param  {[type]} ms [description]
   * @return {[type]}    [description]
   */
  static sleep (ms:number) {
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
      let obj:any = {}
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
  static evenNumber (str:string = '') {
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
}
export default LayerHelper
