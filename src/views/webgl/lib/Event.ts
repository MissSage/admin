import { EInputEventType } from '../common/interface/EInputEventType'
import { TimerCallback } from '../common/interface/Timer'
import { Vec2 } from '../common/math/TSM'

/**
 * CanvasKeyboardEvent和CanvasMouseEvent都继承自本类
 *
 * 基类定义了共同的属性，keyboard或mouse事件都能使用组合键
 *
 * 例如你可以按着ctrl键的同时点击鼠标左键做某些事情
 *
 * 当然你也可以按着alt + a 键做另外一些事情
 */
export class CanvasInputEvent {
  // 三个boolean变量，用来指示alt / ctrl / shift是否被按下
  public altKey: boolean;
  public ctrlKey: boolean;
  public shiftKey: boolean;

  // type是一个枚举对象，用来表示当前的事件类型
  public type: EInputEventType;

  // 构造函数，使用了default参数
  public constructor (type: EInputEventType, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
    this.altKey = altKey
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.type = type
  }
}

export class CanvasMouseEvent extends CanvasInputEvent {
  // button表示当前按下鼠标哪个键
  // [ 0 : 鼠标左键 ，1 ： 鼠标中键，2 ： 鼠标右键]
  public button: number;

  // 基于canvas坐标系的表示
  public canvasPosition: Vec2;

  public constructor (type: EInputEventType, canvasPos: Vec2, button: number, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
    super(type, altKey, ctrlKey, shiftKey)
    this.canvasPosition = canvasPos
    this.button = button
    console.log(this.button)
  }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
  // 当前按下的键的ascii字符
  public key: string;
  // 当前按下的键的ascii码（数字）
  public keyCode: number;
  // 当前按下的键是否不停的触发事件
  public repeat: boolean;

  public constructor (type: EInputEventType, key: string, keyCode: number, repeat: boolean, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
    super(type, altKey, ctrlKey, shiftKey)
    this.key = key
    this.keyCode = keyCode
    this.repeat = repeat
  }
}
