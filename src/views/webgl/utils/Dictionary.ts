export class Dictionary<T> {
  private _items:({[k:string]:T})|Map<string, T>
  private _count:number = 0
  private constructor (useES6Map:boolean = true) {
    useES6Map ? (this._items = new Map<string, T>()) : (this._items = {})
  }

  /**
   * 键值对个数
   */
  public get length ():number {
    return this._count
  }

  /**
   * 是否包含指定键
   * @param key 键
   * @returns boolean
   */
  public contains (key:string):boolean {
    return this._items instanceof Map ? this._items.has(key) : this._items[key] !== undefined
  }

  /**
   * 根据键查找键值对
   * @param key 键
   * @returns 键值对
   */
  public find (key:string):T|undefined {
    return this._items instanceof Map ? this._items.get(key) : this._items[key]
  }

  /**
   * 插入键值对
   * @param key 键
   * @param value 值
   */
  public insert (key:string, value:T):void {
    this._items instanceof Map ? this._items.set(key, value) : (this._items[key] = value)
    this._count++
  }

  /**
   * 根据键移除键值对
   * @param key 键
   * @returns 是否成功
   */
  public remove (key:string):boolean {
    const ret:T|undefined = this.find(key)
    if (ret === undefined) return false
    this._items instanceof Map ? this._items.delete(key) : delete this._items[key]
    this._count--
    return true
  }

  /**
   * 获取所有的键
   */
  public get keys ():string[] {
    const keys:string[] = []
    if (this._items instanceof Map) {
      const keyArray = this._items.keys()
      for (const key of keyArray) {
        keys.push(key)
      }
    } else {
      for (const prop in this._items) {
        keys.push(prop)
      }
    }
    return keys
  }

  /**
   * 获取所有的值
   */
  public get values ():T[] {
    const values:T[] = []
    if (this._items instanceof Map) {
      const vArray = this._items.values()
      for (const value of vArray) {
        values.push(value)
      }
    } else {
      for (const prop in this._items) {
        values.push(this._items[prop])
      }
    }
    return values
  }

  /**
   * 转换成字符串形式的键值对
   * @returns 字符串
   */
  public toString ():string {
    return JSON.stringify(this._items as Map<string, T>)
  }
}
