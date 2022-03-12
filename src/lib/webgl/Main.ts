import { Application } from './common/Application'
import { MeshBuilderApplicaton } from './demo/MeshBuilderApplication'
import { Q3BspApplication } from './demo/Q3BspApplication'
import { Doom3Application } from './demo/Doom3Application'
import { RotatingCubeApplication } from './demo/RotatingCubeApplication'
import { CoordSystemApplication } from './demo/CoordSystemApplicationDemo'
import { BasicWebGLApplication } from './demo/BasicWebGLApplication'
import { MD5SkinedMeshApplication } from './demo/MD5SkinedMeshApplication'
import { AsyncLoadTestApplication } from './demo/AsyncLoadTestApplication'

/**
 * App枚举
 */
export enum EAPPName{
  /**
   * ROTATINGCUBE:旋转实例
   */
    ROTATINGCUBE,
    /**
     * 读取文件测试
     */
    ASYNCLOAD,
    /**
     * 基础webgl实例
     */
    BASICWEBGL,
    /**
     * 颜色着色器
     */
    MESHBUILDER,
    /**
     * 坐标系统运用
     */
    COORDSYSTEM,
    /**
     * Quake3BspScene运用
     */
    Q3BSP,
    /**
     * Doom3运用
     */
    DOOM3PROC,
    /**
     * MD5SkinedMesh
     */
    DOOM3MD5
}

/**
 * 运行应用
 * @param name 应用名称
 * @param canvas 画布
 * @param frameCallback 回调
 */
export function runApplication (name:EAPPName, canvas:HTMLCanvasElement, frameCallback:(app: Application)=>void):void {
  if (name === EAPPName.ROTATINGCUBE) {
    const app: RotatingCubeApplication = new RotatingCubeApplication(canvas)
    app.frameCallback = frameCallback
    app.run()
  } else if (name === EAPPName.ASYNCLOAD) {
    const app:AsyncLoadTestApplication = new AsyncLoadTestApplication(canvas)
    app.run()
  } else if (name === EAPPName.BASICWEBGL) {
    const app:Application = new BasicWebGLApplication(canvas)
    app.frameCallback = frameCallback
    app.run()
  } else if (name === EAPPName.MESHBUILDER) {
    const app: Application = new MeshBuilderApplicaton(canvas)
    app.frameCallback = frameCallback
    app.start()
  } else if (name === EAPPName.COORDSYSTEM) {
    const app: CoordSystemApplication = new CoordSystemApplication(canvas)
    app.frameCallback = frameCallback
    app.run()
  } else if (name === EAPPName.Q3BSP) {
    const app: Application = new Q3BspApplication(canvas)
    app.frameCallback = frameCallback
    app.run()
  } else if (name === EAPPName.DOOM3PROC) {
    const app: Doom3Application = new Doom3Application(canvas)
    app.frameCallback = frameCallback
    app.run()
  } else if (name === EAPPName.DOOM3MD5) {
    const app: MD5SkinedMeshApplication = new MD5SkinedMeshApplication(canvas)
    app.frameCallback = frameCallback
    app.run()
  }
}
