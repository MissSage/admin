import { List } from './List'

export interface IAdapter<T>{
  /**
   * 添加节点
   * @param t 节点
   */
  add(t:T):void
  /**
   * 移除元素（出栈或出列）
   * 返回移除的元素
   */
  remove():T|undefined
  /**
   * 清空
   */
  clear():void
  /**
   * 数组或列表的元素数
   */
  length:number
  /**
   * 是否为空
   */
  isEmpty:boolean
}
export abstract class AdapterBase<T> implements IAdapter<T> {
  protected _arr:Array<T>|List<T>;
  public constructor (useList:boolean = true) {
    this._arr = useList ? new List<T>() : new Array<T>()
  }

  public add (t: T): void {
    this._arr.push(t)
  }

  public abstract remove(): T | undefined;

  public get length ():number {
    return this._arr.length
  }

  public get isEmpty (): boolean {
    return this._arr.length <= 0
  }

  public clear (): void {
    this._arr = this._arr instanceof List ? new List<T>() : new Array<T>()
  }
}
