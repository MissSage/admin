import { SLMessage } from './global'

export const getImageUrl = (name:string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}

/**
   * treeData格式化
   * @param tree
   * @param keys
   * @returns
   */
export const formatTree = (tree:any, keys:any = { label: 'name', value: 'id', children: 'children' }) => {
  tree = tree.map((node:any) => {
    if (node.children && node.children.length) {
      node.children = formatTree(node.children, keys)
    } else {
      delete node.children
    }
    const obj: any = {}
    for (const key in keys) {
      obj[key] = node[keys[key]]
    }
    obj.data = node
    return obj
  })

  return tree
}
/**
 * 转换颜色到rgba
 * @param hex 颜色值 #aaa
 * @param opacity 透明度
 * @returns
 */
export const hexToRgba = (hex: string, opacity: any) => {
  let rgbaColor = ''
  const reg = /^#[\da-f]{6}$/i
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
      '0x' + hex.slice(3, 5)
    )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
  }
  return rgbaColor
}
/**
 * 模拟点击下载
 * @param url
 * @param name
 */
export const downloadFile = (url: string, name: string) => {
  const a = document.createElement('a')
  a.setAttribute('href', url) // a.href='文件链接'
  a.setAttribute('target', '_blank')
  a.setAttribute('download', name) // a.download='文件名'
  a.click()
}
/**
 * 全屏切换
 * @param el 要全屏的元素
 * @returns
 */
export const toggleFullscreen = (el:HTMLElement|null):boolean => {
  if (document.fullscreenEnabled && el) {
    // 退出全屏,三目运算符
    if (document.fullscreenElement != null) {
      document.exitFullscreen && document.exitFullscreen()
      return false
    } else {
      el.requestFullscreen && el.requestFullscreen()
      return true
    }
  } else {
    SLMessage.error('全屏功能不受支持')
    return false
  }
}
