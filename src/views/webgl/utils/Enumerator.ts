import { IAdapter } from './Adapter'
import { Stack } from './Queue'
import { TreeNode } from './TreeNode'
/**
 * 迭代器接口
 */
export interface IEnumerator<T>{
  /**
   * 将迭代器重置为初始状态
   */
  reset():void
  /**
   * 将current设置为下一个元素
   */
  moveNext():boolean
  /**
   * 当前迭代的元素
   */
  readonly current:T|undefined
}
/**
 * 用来决定是使用从左到右还是从右到左的计算方法
 */
export type Indexer = (len:number, idx:number)=>number
export function IndexerL2R (len:number, idx:number):number {
  return idx
}
export function IndexerR2L (len:number, idx:number):number {
  return (len - idx - 1)
}

/**
 * 先根/前序枚举器
 */
export class NodeT2BEnumerator<T, IdxFunc extends Indexer, Adapter extends IAdapter<TreeNode<T>>> implements IEnumerator<TreeNode<T>> {
  private _node:TreeNode<T>|undefined
  private _adapter !:IAdapter<TreeNode<T>>
  private _currNode ! : TreeNode<T>|undefined
  private _indexer ! : IdxFunc

  /**
   * 先根/前序枚举器
   * 从上到下的迭代算法
   * @param node 初始node
   * @param func 向左/向右决定函数
   * @param Oadapter 适配器，比如Stack或Queue
   * @returns 从上到下的先根/前序枚举器
   */
  public constructor (node:TreeNode<T>|undefined, func:IdxFunc, Oadapter:new()=>Adapter) {
    if (node === undefined) return
    this._node = node
    this._indexer = func
    this._adapter = new Oadapter()
    this._adapter.add(this._node)
    this._currNode = undefined
  }

  public reset (): void {
    if (this._node === undefined) return
    this._currNode = undefined
    this._adapter.clear()
    this._adapter.add(this._node)
  }

  public moveNext (): boolean {
    if (this._adapter.isEmpty) return false
    this._currNode = this._adapter.remove()
    if (this._currNode !== undefined) {
      const len:number = this._currNode.childCount
      for (let i = 0; i < len; i++) {
        const childIdx:number = this._indexer(len, i)
        const child:TreeNode<T>|undefined = this._currNode.getChildAt(childIdx)
        if (child !== undefined) {
          this._adapter.add(child)
        }
      }
    }
    return true
  }

  public get current (): TreeNode<T> | undefined {
    return this._currNode
  }
}

/**
 * 后根枚举器
 */
export class NodeB2TEnumerator<T> implements IEnumerator<TreeNode<T>> {
  /**
   * 持有一个枚举器接口
   */
  private _iter:IEnumerator<TreeNode<T>>
  /**
   * 声明一个数组对象
   */
  private _arr ! :Array<TreeNode<T>|undefined>
  /**
   * 当前的数组索引
   */
  private _arrIdx ! :number

  /**
   * 后根枚举器
   * 从下到上的迭代算法
   * @param iter 枚举器接口
   */
  public constructor (iter:IEnumerator<TreeNode<T>>) {
    this._iter = iter
    this.reset()
  }

  public reset (): void {
    this._arr = []
    while (this._iter.moveNext()) {
      this._arr.push(this._iter.current)
    }
    this._arrIdx = this._arr.length
  }

  public get current ():TreeNode<T>|undefined {
    return this._arrIdx < this._arr.length ? this._arr[this._arrIdx] : undefined
  }

  public moveNext (): boolean {
    this._arrIdx--
    return (this._arrIdx >= 0 && this._arrIdx < this._arr.length)
  }
}

export class NodeEnumeratorFactory {
  /**
   * 创建深度优先（Stack)、从左到右（IndexerR2L）、从上到下的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createDfL2rT2bIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, Stack)
    return iter
  }

  /**
   * 创建深度优先（Stack）、从右到左（IndexerL2R）、从上到下的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createDfR2lT2bIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, Stack)
    return iter
  }

  /**
   * 创建广度优先（Queue）、从左到右（IndexerL2R）、从上到下的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createBfL2rT2bIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, Stack)
    return iter
  }

  /**
   * 创建广度优先（Queue）、从右到左（IndexerR2L）、从上到下的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createBfR2lT2bIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, Stack)
    return iter
  }

  /**
   * 创建深度优先（Stack）、从左到右（IndexerL2R）、从下到上的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createDfL2rB2tIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeB2TEnumerator(NodeEnumeratorFactory.createDfR2lT2bIter(node))
    return iter
  }

  /**
   * 创建深度优先（Stack）、从右到左（IndexerR2L）、从下到上的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createDfR2lB2tIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeB2TEnumerator(NodeEnumeratorFactory.createDfL2rT2bIter(node))
    return iter
  }

  /**
   * 创建广优先（Queue）、从左到右（IndexerR2L）、从下到上的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createBfL2rB2tIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeB2TEnumerator(NodeEnumeratorFactory.createBfR2lT2bIter(node))
    return iter
  }

  /**
   * 创建广优先（Queue）、从右到左（IndexerL2R）、从下到上的枚举器
   * @param node 树节点
   * @returns 枚举器
   */
  public static createBfR2lB2tIter <T> (node:TreeNode<T>|undefined):IEnumerator<TreeNode<T>> {
    const iter:IEnumerator<TreeNode<T>> = new NodeB2TEnumerator(NodeEnumeratorFactory.createBfL2rT2bIter(node))
    return iter
  }
}
