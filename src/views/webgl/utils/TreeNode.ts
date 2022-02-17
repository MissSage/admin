import { Indexer, IndexerL2R } from './Enumerator'
interface NodeCallback<T>{
  (node:any):void
}
export class TreeNode<T> {
  private _parent:TreeNode<T>|undefined
  private _children:Array<TreeNode<T>>|undefined
  public name:string
  public data:T|undefined

  /**
   * 判断一个节点是不是当前节点的祖先节点
   * @param ancestor 待判断的节点
   * @returns boolean
   */
  public isDescendantOf (ancestor:TreeNode<T>|undefined):boolean {
    if (ancestor === undefined) return false
    const node:TreeNode<T>|undefined = this._parent
    for (let node:TreeNode<T>|undefined = this._parent; node !== undefined; node = node._parent) {
      if (node === ancestor) return true
    }
    return false
  }

  /**
   * 删除指定索引的节点
   * @param index 索引
   * @returns 返回删除的节点
   */
  public removeChildAt (index:number):TreeNode<T>|undefined {
    if (this._children === undefined) return undefined
    const children:TreeNode<T>|undefined = this.getChildAt(index)
    if (children === undefined) return undefined
    this._children.splice(index, 1)
    children._parent = undefined
    return children
  }

  /**
   * 移除指定节点
   * @param child 子节点
   * @returns 返回移除的节点
   */
  public removeChild (child:TreeNode<T>|undefined):TreeNode<T>|undefined {
    if (child === undefined || this._children === undefined) return undefined
    let index:number = -1
    for (let i = 0; i < this._children.length; i++) {
      if (this.getChildAt(i) === child) {
        index = i
        break
      }
    }
    if (index === -1) return undefined
    return this.removeChildAt(index)
  }

  /**
   * 移除当前节点
   * @returns 返回当前节点
   */
  public remove ():TreeNode<T>|undefined {
    if (this._parent !== undefined) return this._parent.removeChild(this)
    return undefined
  }

  /**
   * 在指定索引添加节点
   * @param child 添加的节点
   * @param index 索引
   * @returns 返回添加的子节点
   */
  public addChildAt (child:TreeNode<T>, index:number):TreeNode<T>|undefined {
    if (this.isDescendantOf(child)) return undefined
    if (this._children === undefined) {
      this._children = []
    }
    if (index >= 0 && index <= this._children.length) {
      // 当添加的节点是有父节点的，则需要先将其从其父节点中移除
      if (child._parent !== undefined)child._parent.removeChild(child)
      // 将当前节点设置为添加的节点的父节点
      child._parent = this
      // 并加入当前节点的子节点中
      this._children.splice(index, 0, child)
      return child
    }
    return undefined
  }

  public addChild (child:TreeNode<T>):TreeNode<T>|undefined {
    if (this._children === undefined) {
      this._children = []
    }
    return this.addChildAt(child, this._children.length)
  }

  /**
   * 节点
   * @param data 数据
   * @param parent 父节点
   * @param name 名称
   */
  public constructor (data:T|undefined = undefined, parent:TreeNode<T>|undefined = undefined, name:string = '') {
    this._parent = parent
    this._children = undefined
    this.name = name
    this.data = data
    if (this._parent !== undefined) {
      this._parent.addChild(this)
    }
  }

  public get parent ():TreeNode<T>|undefined {
    return this._parent
  }

  public getChildAt (index:number):TreeNode<T>|undefined {
    if (this._children === undefined) return undefined
    if (index < 0 || index >= this._children.length) return undefined
    return this._children[index]
  }

  public get childCount ():number {
    if (this._children !== undefined) return this._children.length
    return 0
  }

  public hasChild ():boolean {
    return this._children !== undefined && this._children.length > 0
  }

  public get root ():TreeNode<T>|undefined {
    let curr:TreeNode<T>|undefined = this
    while (curr !== undefined && curr.parent !== undefined) {
      curr = curr.parent
    }
    return curr
  }

  /**
   * 获取当前节点的深度
   */
  public get depth ():number {
    let curr:TreeNode<T>|undefined = this
    let level:number = 0
    while (curr !== undefined && curr.parent !== undefined) {
      curr = curr.parent
      level++
    }
    return level
  }

  public repeatString (target:string, n:number):string {
    let total:string = ''
    for (let i = 0; i < n; i++) {
      total += target
    }
    return total
  }

  public visit (preOrderFunc:NodeCallback<T>|null = null, postOrderFunc:NodeCallback<T>|null = null, indexFunc:Indexer = IndexerL2R):void {
    if (preOrderFunc !== null) {
      preOrderFunc(this)
    }
    const arr:Array<TreeNode<T>>|undefined = this._children
    if (arr !== undefined) {
      for (let i :number = 0; i < arr.length; i++) {
        const child:TreeNode<T>|undefined = this.getChildAt(indexFunc(arr.length, i))
        if (child !== undefined) {
          child.visit(preOrderFunc, postOrderFunc, indexFunc)
        }
      }
    }
    if (postOrderFunc !== null) {
      postOrderFunc(this)
    }
  }
}
