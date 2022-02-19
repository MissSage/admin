import { CameraApplication } from '../lib/CameraApplication'
import { GLProgram } from '../webgl/WebGLProgram'
import { GLProgramCache } from '../webgl/WebGLProgramCache'
import { HttpRequest } from '../common/utils/HttpRequest'
import { Mat4, Vec3 } from '../common/math/TSM'
import { GLMeshBuilder, EVertexLayout } from '../webgl/WebGLMesh'
import { GLAttribState } from '../webgl/WebGLAttribState'
import { GLTextureCache } from '../webgl/WebGLTextureCache'
import { MD5SkinedMesh } from '../lib/MD5SkinedMesh'

export class MD5SkinedMeshApplication extends CameraApplication {
    public program: GLProgram;
    public texBuilder: GLMeshBuilder;

    public angle: number = 0;
    public model: MD5SkinedMesh;

    public constructor (canvas: HTMLCanvasElement) {
      super(canvas, { premultipliedAlpha: false }, true)
      this.program = GLProgramCache.instance.getMust('texture')
      this.texBuilder = new GLMeshBuilder(this.gl, GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT, this.program, GLTextureCache.instance.getMust('default'), EVertexLayout.INTERLEAVED)
      this.model = new MD5SkinedMesh()
      this.camera.z = 4
    }

    public async run (): Promise<void> {
      let response: string = await HttpRequest.loadTextFileAsync(MD5SkinedMesh.path + 'suit.md5mesh')
      this.model.parse(response)
      await this.model.loadTextures(this.gl)
      response = await HttpRequest.loadTextFileAsync(MD5SkinedMesh.path + 'suit_walk.md5anim')
      this.model.parseAnim(response)
      this.start()
    }

    public currFrame: number = 0;
    public update (elapsedMsec: number, intervalSec: number): void {
      super.update(elapsedMsec, intervalSec)
      this.currFrame++
      this.currFrame %= this.model.anims[0].frames.length // 连续播放
      this.model.playAnim(0, this.currFrame) // 更新0号动画序列
      this.angle += 0.5
    }

    public render (): void {
      this.matStack.loadIdentity()
      this.matStack.rotate(-90, Vec3.right)

      this.matStack.rotate(this.angle, Vec3.forward)
      Mat4.product(this.camera.viewProjectionMatrix, this.matStack.modelViewMatrix, Mat4.m0)
      this.model.drawBindPose(this.texBuilder, Mat4.m0)

      this.matStack.pushMatrix()
      this.matStack.translate(new Vec3([1.0, 0, 0]))
      Mat4.product(this.camera.viewProjectionMatrix, this.matStack.modelViewMatrix, Mat4.m0)
      this.model.drawAnimPose(this.texBuilder, Mat4.m0)
      this.matStack.popMatrix()
    }
}
