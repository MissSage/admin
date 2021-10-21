
export interface GeoData{
  geometry:{
    type:string
    x:number
    y:number
  }
  attributes: {
    ObjectID: number
    name: string
    type: string
    tieluju: string
    address: string
  }
}
