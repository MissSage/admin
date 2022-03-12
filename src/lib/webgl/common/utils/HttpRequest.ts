
/**
 * 有时我们在完成时需要按名称查询对应的HTMLImageElement对象
 * 此时就需要ImageInfo结构了
 */
export class ImageInfo {
    public name: string;
    public image: HTMLImageElement;

    /**
     * 创建图片信息
     * @param path 图片路径
     * @param image 图片元素
     */
    public constructor (path: string, image: HTMLImageElement) {
      this.name = path
      this.image = image
    }
}

/**
 * http请求
 */
export class HttpRequest {
  /**
   * 异步加载图片
   *
   * 这个函数要起作用，必须要在tsconfig.json中将default的es5改成ES2015
   * @param url
   * @returns
   */
  public static loadImageAsync (url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject): void => {
      const image = new Image()

      image.onload = function () {
        resolve(image)
      }

      image.onerror = function () {
        reject(new Error('Could not load image at ' + url))
      }

      image.src = url
    })
  }

  /**
   * 异步加载图片，发生错误不会警告
   *
   * 这个函数要起作用，必须要在tsconfig.json中将default的es5改成ES2015
   * @param url
   * @param name
   * @returns
   */
  public static loadImageAsyncSafe (url: string, name: string = url): Promise<ImageInfo | null> {
    return new Promise((resolve, reject): void => {
      const image: HTMLImageElement = new Image()
      image.onload = function () {
        const info: ImageInfo = new ImageInfo(name, image)
        resolve(info)
      }

      image.onerror = function () {
        resolve(null)
      }

      image.src = url
    })
  }

  /**
   * 异步加载文件
   * @param url
   * @returns
   */
  public static loadTextFileAsync (url: string): Promise<string> {
    return new Promise((resolve, reject): void => {
      const xhr: XMLHttpRequest = new XMLHttpRequest()
      xhr.onreadystatechange = (ev: Event): any => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText)
          } else {
            reject(new Error('Could not load file at ' + url))
          }
        }
      }

      xhr.open('get', url, true, null, null)
      xhr.send()
    })
  }

  /**
   * 异步加载ArrayBuffer
   * @param url
   * @returns
   */
  public static loadArrayBufferAsync (url: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject): void => {
      const xhr: XMLHttpRequest = new XMLHttpRequest()
      xhr.responseType = 'arraybuffer'
      xhr.onreadystatechange = (ev: Event): any => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.response as ArrayBuffer)
        }
      }
      xhr.open('get', url, true, null, null)
      xhr.send()
    })
  }
}
