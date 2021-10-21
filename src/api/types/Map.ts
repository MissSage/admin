interface IGisResourceProper{
  name?: string
  groupname?: string
  type?: string
  config: any[],
  filter?:boolean
}

export interface IGisResource{
  [propname:string]:IGisResourceProper
}

export interface Iinitextent{
  xmax: number
  xmin: number
  ymax: number
  ymin: number
}
