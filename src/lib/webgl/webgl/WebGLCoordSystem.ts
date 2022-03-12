import { Vec3 } from '../common/math/TSM'
/**
 * 坐标系统
 */
export class GLCoordSystem {
  /**
   * 当前坐标系被绘制在哪个视口中
   */
    public viewport: number[] = [];
    /**
     * 当前坐标系绕哪个轴旋转
     */
    public axis: Vec3;
    /**
     * 当前坐标系的旋转的角度(不是弧度！)
     */
    public angle: number;
    /**
     * 当前坐标系的位置，如果是多视口渲染的话，就为[0,0,0]
     */
    public pos: Vec3;
    /**
     * 是否绘制旋转轴
     */
    public isDrawAxis: boolean;
    /**
     * 是否绘制为D3D左手系
     */
    public isD3D: boolean;

    /**
     * 创建坐标系
     * @param viewport 坐标系的视窗
     * @param pos 坐标原点
     * @param axis 当前坐标系绕哪个轴旋转
     * @param angle 当前坐标系的旋转的角度(不是弧度！)
     * @param isDrawAxis 当前坐标系的位置，如果是多视口渲染的话，就为[0,0,0]
     * @param isD3D 是否绘制为D3D左手系
     */
    public constructor (viewport: number[], pos: Vec3 = Vec3.zero, axis: Vec3 = Vec3.up, angle: number = 0, isDrawAxis: boolean = false, isD3D: boolean = false) {
      this.viewport = viewport
      this.angle = angle
      this.axis = axis
      this.pos = pos
      this.isDrawAxis = isDrawAxis
      this.isD3D = isD3D
    }

    /**
     * 在指定宽度的视窗中创建坐标系矩阵
     * @param width 总宽度
     * @param height 总高度
     * @param row 行数(默认2)
     * @param colum 列数(默认2)
     * @returns
     */
    public static makeViewportCoordSystems (width: number, height: number, row: number = 2, colum: number = 2): GLCoordSystem[] {
      const coords: GLCoordSystem[] = []
      const w: number = width / colum // 一行有多少个
      const h: number = height / row // 一列右多少个
      // 循环生成GLCoordSystem对象，每个GLCoordSystem内置了表示viewport的数组
      for (let i: number = 0; i < colum; i++) {
        for (let j: number = 0; j < row; j++) {
          // viewport是[ x , y , width , height ]格式
          coords.push(new GLCoordSystem([i * w, j * h, w, h]))
        }
      }
      // 将生成的GLCoordSystem数组返回
      return coords
    }
}
