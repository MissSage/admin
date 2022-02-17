import { AdapterBase } from './Adapter'

export class Queue<T> extends AdapterBase<T> {
  /**
   * 出列
   * @returns 移除的节点
   */
  public remove (): T | undefined {
    return this._arr.length > 0 ? this._arr.shift() : undefined
  }
}

export class Stack<T> extends AdapterBase<T> {
  /**
   * 出栈
   * @returns 移除的节点
   */
  public remove (): T | undefined {
    return this._arr.length > 0 ? this._arr.pop() : undefined
  }
}
