/**
 * 回调函数类型别名
 *
 * 回调函数需要第三方实现和设置，所有导出该回调函数
 */
export type TimerCallback = (id: number, data: any) => void;
