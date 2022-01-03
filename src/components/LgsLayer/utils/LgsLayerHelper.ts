class LayerHelper {
  static maskClose (event:MouseEvent, layer:any, id:string) {
    const mask = event && event.target && (event.target as HTMLElement).getAttribute('class')
    if (mask && (mask.indexOf('notify-mask') > -1 || mask.indexOf('icon-remove') > -1)) {
      layer.close(id)
    }
  }
}
export default LayerHelper
