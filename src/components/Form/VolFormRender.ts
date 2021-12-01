import { h } from 'vue'

export default {
  name: 'FormExpand',
  functional: true,
  props: {
    render: Function,
    par: {}// 测试参数
  },
  render: ({ render, par }:any) => {
    return render(h, { par }) // h();
  }
}
