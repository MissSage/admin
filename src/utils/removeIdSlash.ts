/**
 * 按指定逻辑处理给定id中的 -
 * @param str
 * @returns
 */
export function removeSlash (str: string) {
  return (
    str.substring(15, 18) +
    str.substring(9, 13) +
    str.substring(0, 8) +
    str.substring(19, 23) +
    str.substring(24)
  )
}

/**
 * id去 - 处理  idRemoveSlash(data, 'id')
 * @param data
 * @param setKey
 * @returns
 */
export function idRemoveSlash (data: any, setKey: string | number) {
  setItemKey(data)

  function setItemKey (sData: any) {
    for (const item of sData) {
      item[setKey] = removeSlash(item.id)
      if (item.children && item.children.length > 0) {
        setItemKey(item.children)
      }
    }
  }

  return data
}
/**
 * 按指定逻辑为id增加 -
 * @param src
 * @returns
 */
export function addSlash (src: string) {
  return (
    src.substring(7, 15) +
    '-' +
    src.substring(3, 7) +
    '-1' +
    src.substring(0, 3) +
    '-' +
    src.substring(15, 19) +
    '-' +
    src.substring(19)
  )
}
