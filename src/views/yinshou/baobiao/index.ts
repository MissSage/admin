export const PayMeTypes = [
  { label: '柜台现金', value: 53 },
  { label: '微信扫码', value: 54 },
  { label: '微信公众号', value: 55 },
  { label: '微信付款码', value: 56 },
  { label: '支付宝付款码', value: 57 },
  { label: '支付宝扫码', value: 58 },
  { label: 'Pos机刷卡', value: 59 },
  { label: '现金支付', value: 60 }
]
/**
 * 导出报表
 * @param data
 */
export const ExportReport = (data: any) => {
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', '维修统计报表.xlsx')
  document.body.appendChild(link)
  link.click()
}
