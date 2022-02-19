import { Vec3, Mat4 } from '../common/math/TSM'
import { MathHelper } from '../common/math/MathHelper'
export enum EMatrixMode {
    MODELVIEW,
    PROJECTION,
    TEXTURE
}

export class GLMatrixStack {
    private _mvStack: Mat4[];
    private _projStack: Mat4[];
    private _texStack: Mat4[];
    public matrixMode: EMatrixMode;

    public constructor () {
      // 初始化时每个矩阵栈都先添加一个正交归一化后的矩阵
      this._mvStack = []
      this._mvStack.push(new Mat4())

      this._projStack = []
      this._projStack.push(new Mat4())

      this._texStack = []
      this._texStack.push(new Mat4())

      this.matrixMode = EMatrixMode.MODELVIEW
    }

    public get modelViewMatrix (): Mat4 {
      if (this._mvStack.length <= 0) {
        throw new Error('model view matrix stack为空！')
      }
      return this._mvStack[this._mvStack.length - 1]
    }

    public get projectionMatrix (): Mat4 {
      if (this._projStack.length <= 0) {
        throw new Error('projection matrix stack为空！')
      }
      return this._projStack[this._projStack.length - 1]
    }

    public get modelViewProjectionMatrix (): Mat4 {
      const ret: Mat4 = new Mat4()
      this.projectionMatrix.copy(ret)
      ret.multiply(this.modelViewMatrix)
      return ret
    }

    public get normalMatrix (): Mat4 {
      const ret: Mat4 = new Mat4()
      this.modelViewMatrix.copy(ret)
      this.modelViewMatrix.inverse(ret)
      ret.transpose()
      return ret
    }

    public get textureMatrix (): Mat4 {
      if (this._texStack.length <= 0) {
        throw new Error('projection matrix stack为空！')
      }
      return this._texStack[this._texStack.length - 1]
    }

    public pushMatrix (): GLMatrixStack {
      const mat: Mat4 = new Mat4()
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.copy(mat)
          this._mvStack.push(mat)
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.copy(mat)
          this._projStack.push(mat)
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.copy(mat)
          this._texStack.push(mat)
          break
      }
      return this
    }

    public popMatrix (): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this._mvStack.pop()
          break
        case EMatrixMode.PROJECTION:
          this._projStack.pop()
          break
        case EMatrixMode.TEXTURE:
          this._texStack.pop()
          break
      }
      return this
    }

    public loadIdentity (): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.setIdentity()
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.setIdentity()
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.setIdentity()
          break
      }
      return this
    }

    public loadMatrix (mat: Mat4): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          mat.copy(this.modelViewMatrix)
          break
        case EMatrixMode.PROJECTION:
          mat.copy(this.projectionMatrix)
          break
        case EMatrixMode.TEXTURE:
          mat.copy(this.textureMatrix)
          break
      }
      return this
    }

    public perspective (fov: number, aspect: number, near: number, far: number, isRadians: boolean = false): GLMatrixStack {
      this.matrixMode = EMatrixMode.PROJECTION
      if (isRadians === false) {
        fov = MathHelper.toRadian(fov)
      }
      const mat: Mat4 = Mat4.perspective(fov, aspect, near, far)
      this.loadMatrix(mat)
      this.matrixMode = EMatrixMode.MODELVIEW
      // 是否要调用loadIdentity方法???
      this.loadIdentity()
      return this
    }

    public frustum (left: number, right: number, bottom: number, top: number, near: number, far: number): GLMatrixStack {
      this.matrixMode = EMatrixMode.PROJECTION
      const mat: Mat4 = Mat4.frustum(left, right, bottom, top, near, far)
      this.loadMatrix(mat)
      this.matrixMode = EMatrixMode.MODELVIEW
      // 是否要调用loadIdentity方法???
      this.loadIdentity()
      return this
    }

    public ortho (left: number, right: number, bottom: number, top: number, near: number, far: number): GLMatrixStack {
      this.matrixMode = EMatrixMode.PROJECTION
      const mat: Mat4 = Mat4.orthographic(left, right, bottom, top, near, far)
      this.loadMatrix(mat)
      this.matrixMode = EMatrixMode.MODELVIEW
      // 是否要调用loadIdentity方法???
      this.loadIdentity()
      return this
    }

    public lookAt (pos: Vec3, target: Vec3, up: Vec3 = Vec3.up): GLMatrixStack {
      this.matrixMode = EMatrixMode.MODELVIEW
      const mat: Mat4 = Mat4.lookAt(pos, target, up)
      this.loadMatrix(mat)
      return this
    }

    public makeView (pos: Vec3, xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): GLMatrixStack {
      zAxis.normalize()

      // forward cross right = up
      Vec3.cross(zAxis, xAxis, yAxis)
      yAxis.normalize()

      // up cross forward = right
      Vec3.cross(yAxis, zAxis, xAxis)
      xAxis.normalize()

      const x: number = -Vec3.dot(xAxis, pos)
      const y: number = -Vec3.dot(yAxis, pos)
      const z: number = -Vec3.dot(zAxis, pos)

      const mat: Mat4 = this._mvStack[this._mvStack.length - 1]
      mat.values[0] = xAxis.x
      mat.values[1] = yAxis.x
      mat.values[2] = zAxis.x
      mat.values[3] = 0.0

      mat.values[4] = xAxis.y
      mat.values[5] = yAxis.y
      mat.values[6] = zAxis.y
      mat.values[7] = 0.0

      mat.values[8] = xAxis.z
      mat.values[9] = yAxis.z
      mat.values[10] = zAxis.z
      mat.values[11] = 0.0

      mat.values[12] = x
      mat.values[13] = y
      mat.values[14] = z
      mat.values[15] = 1.0

      return this
    }

    public multMatrix (mat: Mat4): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.multiply(mat)
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.multiply(mat)
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.multiply(mat)
          break
      }
      return this
    }

    public translate (pos: Vec3): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.translate(pos)
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.translate(pos)
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.translate(pos)
          break
      }
      return this
    }

    public rotate (angle: number, axis: Vec3, isRadians: boolean = false): GLMatrixStack {
      if (isRadians === false) {
        angle = MathHelper.toRadian(angle)
      }
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.rotate(angle, axis)
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.rotate(angle, axis)
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.rotate(angle, axis)
          break
      }
      return this
    }

    public scale (s: Vec3): GLMatrixStack {
      switch (this.matrixMode) {
        case EMatrixMode.MODELVIEW:
          this.modelViewMatrix.scale(s)
          break
        case EMatrixMode.PROJECTION:
          this.projectionMatrix.scale(s)
          break
        case EMatrixMode.TEXTURE:
          this.textureMatrix.scale(s)
          break
      }
      return this
    }
}

/**
 * 模拟OpenGL1.1中矩阵堆栈
 */
export class GLWorldMatrixStack {
    private _worldMatrixStack: Mat4[];

    /**
     * 初始化时每个矩阵栈都先添加一个正交归一化后的矩阵
     */
    public constructor () {
      this._worldMatrixStack = []
      this._worldMatrixStack.push(new Mat4())
    }

    public get modelViewMatrix (): Mat4 {
      if (this._worldMatrixStack.length <= 0) {
        throw new Error(' model matrix stack为空！')
      }
      return this._worldMatrixStack[this._worldMatrixStack.length - 1]
    }

    /**
     * 添加矩阵
     * @returns
     */
    public pushMatrix (): GLWorldMatrixStack {
      const mv: Mat4 = new Mat4()
      this.modelViewMatrix.copy(mv)
      this._worldMatrixStack.push(mv)
      return this
    }

    public popMatrix (): GLWorldMatrixStack {
      this._worldMatrixStack.pop()
      return this
    }

    public loadIdentity (): GLWorldMatrixStack {
      this.modelViewMatrix.setIdentity()
      return this
    }

    public loadMatrix (mat: Mat4): GLWorldMatrixStack {
      mat.copy(this.modelViewMatrix)
      return this
    }

    public multMatrix (mat: Mat4): GLWorldMatrixStack {
      this.modelViewMatrix.multiply(mat)
      return this
    }

    /**
     * 移动
     * @param pos 移动的值
     * @returns
     */
    public translate (pos: Vec3): GLWorldMatrixStack {
      this.modelViewMatrix.translate(pos)
      return this
    }

    /**
     * 使用弧度，绕Z轴进行Roll旋转
     * @param angle
     * @param axis
     * @param isRadians
     * @returns
     */
    public rotate (angle: number, axis: Vec3, isRadians: boolean = false): GLWorldMatrixStack {
      if (isRadians === false) {
        angle = MathHelper.toRadian(angle)
      }
      this.modelViewMatrix.rotate(angle, axis)
      return this
    }

    public scale (s: Vec3): GLWorldMatrixStack {
      this.modelViewMatrix.scale(s)
      return this
    }
}
