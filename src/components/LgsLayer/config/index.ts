let $ELEMENT:any = {}
const setConfig = (option:any) => {
  $ELEMENT = option
}
const getConfig = (key:any) => {
  return $ELEMENT[key]
}
export { getConfig, setConfig }
