export enum EInputEventType
{
    /**
     * 总类，表示鼠标事件
     */
    MOUSEEVENT, //
    /**
     *鼠标按下事件
     */
    MOUSEDOWN,
    /**
     * // 鼠标弹起事件
     */
    MOUSEUP,

    /**
     * 鼠标移动事件, move事件发生在当前鼠标指针之下的ISprite对象
     */
    MOUSEMOVE,

    /**
     * 鼠标拖动事件, drag事件发生在mouseDown选中的ISprite对象上
     */
    MOUSEDRAG,
    /**
     * 键盘事件
     */
    KEYBOARDEVENT,
    /**
     * 总类，键按下事件
     */
    KEYUP,

    /**
     * 键弹起事件
     */
    KEYDOWN,
    /**
     * 按键事件
     */
    KEYPRESS
}
