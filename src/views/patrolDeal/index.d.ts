type IStepStoreDialog= {
  visible: boolean,
  title: string,
  close: () => void,
  currentId: string,
  labelWidth?:string|number
}