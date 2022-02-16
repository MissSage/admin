export class ListNode<T> {
  public next:ListNode<T>|null
  public prev:ListNode<T>|null
  public data:T|undefined
  public constructor (data:T|undefined = undefined) {
    this.next = this.prev = null
    this.data = data
  }
}
export class List<T> {
  private _headerNode:ListNode<T>
  private _length:number
  public constructor () {
    this._headerNode = new ListNode<T>()
    this._headerNode.next = this._headerNode
    this._headerNode.prev = this._headerNode
    this._length = 0
  }

  /**
   * 判断链表是否为空
   * @returns 空链表则返回true
   */
  public empty ():boolean {
    return this._headerNode.next === this._headerNode
  }

  /**
   * 链表的长度
   */
  public get length ():number {
    return this._length
  }

  /**
   * 开始节点
   * @returns 返回链表的开始节点
   */
  public begin ():ListNode<T> {
    if (this._headerNode.next === null) {
      throw new Error('头节点的next指针必须不为null')
    }
    return this._headerNode.next
  }

  /**
   * 末尾节点
   * @returns 返回链表的末尾节点
   */
  public end ():ListNode<T> {
    return this._headerNode
  }

  /**
   * 判断链表中是否存在包含指定数据的节点
   * @param data 指定数据
   * @returns 存在则返回true,否则返回false
   */
  public contains (data:T):boolean {
    for (let link:ListNode<T>|null = this._headerNode.next; link !== null && link !== this._headerNode; link = link.next) {
      if (link.data !== undefined && link.data === data) return true
    }
    return false
  }

  /**
   * 往next方向遍历
   * @param cb 循环回调，参数为遍历到的节点的data
   */
  public forNext (cb:(data:T)=>void):void {
    for (let link:ListNode<T>|null = this._headerNode.next; link !== null && link !== this._headerNode; link = link.next) {
      if (link.data !== undefined) {
        cb(link.data)
      }
    }
  }

  /**
   * 往prev方向遍历
   * @param cb 循环回调，参数为遍历到的节点的data
   */
  public forPrev (cb:(data:T)=>void):void {
    for (let link:ListNode<T>|null = this._headerNode.prev; link !== null && link !== this._headerNode; link = link.prev) {
      if (link.data !== undefined) {
        cb(link.data)
      }
    }
  }

  /**
   * 往链表指定节点前面添加节点
   * @param node 指定的节点
   * @param data 添加的节点的数据
   * @returns 返回添加的节点
   */
  public insertBefore (node:ListNode<T>, data:T):ListNode<T> {
    const ret:ListNode<T> = new ListNode<T>(data)
    ret.next = node
    ret.prev = node.prev
    if (node.prev !== null) {
      node.prev.next = ret
    }
    node.prev = ret
    this._length++
    return ret
  }

  /**
   * 移除指定的节点
   * @param node 指定的节点
   */
  public remove (node:ListNode<T>):void {
    const next:ListNode<T>|null = node.next
    const prev:ListNode<T>|null = node.prev
    prev !== null && (prev.next = next)
    next !== null && (next.prev = prev)
    this._length--
  }

  /**
   * 往链表末尾添加节点
   * @param data 返回添加的节点的data
   */
  public push (data:T):void {
    this.insertBefore(this.end(), data)
  }

  /**
   * 删除链表结尾的节点
   * @returns 返回删除的节点的data 当链表只有头节点时，返回undefined
   */
  public pop ():T|undefined {
    const prev:ListNode<T>|null = this.end().prev
    if (prev !== null) {
      const ret:T|undefined = prev.data
      this.remove(prev)
      return ret
    }
    return undefined
  }

  /**
   * 移除第一个节点
   * @returns 返回移除的节点的data
   */
  public shift ():T|undefined {
    const ret:T|undefined = this.begin().data
    this.remove(this.begin())
    return ret
  }

  /**
   * 往链表开头插入指定data的节点
   * @param data 插入的data
   */
  public unshift (data:T):void {
    this.insertBefore(this.begin(), data)
  }
}
