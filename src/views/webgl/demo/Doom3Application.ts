import { CameraApplication } from '../lib/CameraApplication'
import { GLProgram } from '../webgl/WebGLProgram'
import { Doom3ProcScene } from '../lib/Doom3ProcScene'
import { GLProgramCache } from '../webgl/WebGLProgramCache'
import { DrawHelper } from '../lib/DrawHelper'
import { Mat4, Vec3, Vec4 } from '../common/math/TSM'

export class Doom3Application extends CameraApplication {
    public program: GLProgram;
    public colorProgram:GLProgram;
    public scene: Doom3ProcScene;
    public angle:number = 0;

    public constructor (canvas: HTMLCanvasElement) {
      super(canvas, { premultipliedAlpha: false }, true)
      this.program = GLProgramCache.instance.getMust('texture')
      this.colorProgram = GLProgramCache.instance.getMust('color')
      this.scene = new Doom3ProcScene(this.gl)
    }

    public async run (): Promise<void> {
      await this.scene.parseDoom3Map('./data/doom3/level.proc')
      this.camera.y = this.scene.mins.y + 5
      super.run()
    }

    public render (): void {
      this.gl.disable(this.gl.CULL_FACE)
      this.scene.draw(this.camera, this.program, this.builder)
      this.scene.drawBoundBox(this.builder, this.camera, this.colorProgram)

      this.matStack.loadIdentity()
      this.matStack.translate(new Vec3([0, 6, 0]))
      this.matStack.rotate(this.angle, Vec3.up)

      Mat4.product(this.camera.viewProjectionMatrix, this.matStack.modelViewMatrix, Mat4.m0)

      this.colorProgram.bind()
      DrawHelper.drawWireFrameCubeBox(this.builder, Mat4.m0, 0.2, new Vec4([0, 0, 1, 1]))
      this.colorProgram.unbind()
      this.angle += 1
      this.gl.enable(this.gl.CULL_FACE)
    }
}
