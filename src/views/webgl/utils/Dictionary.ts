export class Dictionary<T> {
  private _items:({[k:string]:T})|Map<string, T>
  private _count:number = 0
  private constructor (useES6Map:boolean = true) {
    useES6Map ? (this._items = new Map<string, T>()) : (this._items = {})
  }

  public get length ():number {
    return this._count
  }

  public contains (key:string):boolean {
    return this._items instanceof Map ? this._items.has(key) : this._items[key] !== undefined
  }

  public find (key:string):T|undefined {
    return this._items instanceof Map ? this._items.get(key) : this._items[key]
  }

  public insert (key:string, value:T):void {
    this._items instanceof Map ? this._items.set(key, value) : (this._items[key] = value)
    this._count++
  }

  public remove (key:string):boolean {
    const ret:T|undefined = this.find(key)
    if (ret === undefined) return false
    this._items instanceof Map ? this._items.delete(key) : delete this._items[key]
    this._count--
    return true
  }

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

  public toString ():string {
    return JSON.stringify(this._items as Map<string, T>)
  }
}
