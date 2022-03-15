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
