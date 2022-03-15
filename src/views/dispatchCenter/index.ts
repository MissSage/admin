export const cityApi = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js'
// 百度天气接口需要百度的ak
export const weatherApi = (city:string) => `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=EGgzZ22dsboWQEcPQ6KDQLknQd3YkkkP`