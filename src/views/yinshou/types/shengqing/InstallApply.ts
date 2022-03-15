export type IPostStatusParams_SH = {
  status: '1' | '2' | '9' | '10'
}
export type IPostStatusParams_SG = {
  status: '7' | '8'
  obj?: {
    status: '0' | '1'
    time: string
    persong: string
    remark: string
    img: string
  }
}
export type IPostStatusParams_JF = {
  status: '5' | '6'
  obj?: {
    status: '0' | '1'
    time: string
  }
}
export type IPostStatusParams_KC = {
  status: '3' | '4'
  obj?: {
    status: '0' | '1'
    person: string
    time: string
    otherCost: number
    remark: string
    img: string
    file: string
  }
}
export type IPostStatusParams =
  | IPostStatusParams_SH
  | IPostStatusParams_SG
  | IPostStatusParams_JF
  | IPostStatusParams_KC

export type IQuery_YinShou_Install = {
  page?: number
  rows?: number
  keywords?: string
}
