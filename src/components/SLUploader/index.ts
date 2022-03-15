import { FileItem } from '@/common/types/common'

export const formateFiles = (fileStrings: string | any[]): FileItem[] => {
  if (!fileStrings) {
    return []
  }

  if (fileStrings instanceof Array) {
    return fileStrings.map(item => {
      if (item.url) {
        return {
          url: item.url,
          name: item.name || item.split('/').pop() || 'default'
        } as FileItem
      } else {
        return {
          url: item,
          name: item.split('/').pop() || 'default'
        }
      }
    })
  } else {
    // 如果不是数组则整理成数组
    try {
      const fileitems: FileItem[] = JSON.parse(fileStrings)
      return fileitems instanceof Array ? fileitems : []
    } catch (error: any) {
      const files = fileStrings.split(',')
      return files.map(item => {
        return {
          url: item,
          name: item.split('/').pop() || 'default'
        }
      })
    }
  }
}

export const fileStrToArr = (fileStr?: string): string[] => {
  try {
    let result: string[] = []
    const imgs = fileStr ? JSON.parse(fileStr.toString()) : ''
    if (imgs instanceof Array) {
      result = imgs.map(obj => obj.url || obj)
    } else {
      result = fileStr ? [fileStr] : []
    }
    return result
  } catch (error) {
    return fileStr?.split(',') || []
    // if (fileStr?.indexOf(',')) {
    // }
    // return fileStr ? [fileStr] : []
  }
}
