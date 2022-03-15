export const getPieData = (): IPieItem[] => {
  return [
    { value: 10, name: '紧急' },
    { value: 20, name: '一般' },
    { value: 40, name: '普通' },
    { value: 30, name: '严重' }
  ]
}
export interface IPieItem {
  value: number
  name: string
}
