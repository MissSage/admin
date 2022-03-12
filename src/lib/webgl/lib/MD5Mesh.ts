import { Vec3, Vec2, Quat, Mat4 } from '../common/math/TSM'

// MD5 Mesh文件格式
// MD5模型的顶点数据结构
export class MD5Vertex {
    public uv: Vec2; // 纹理坐标
    public firstWeight: number; // 指向weights列表中的索引号
    public numWeight: number; // 从上面索引开始，有多少个weight值
    public finalPosInModelSpace: Vec3; // 位置坐标
    public animiatedPosInModelSpace:Vec3; // 每运行一帧动画后要进行更新操作
    public constructor () {
      this.uv = new Vec2()
      this.firstWeight = -1 // 初始化为-1
      this.numWeight = 0 // 初始化为0个
      this.finalPosInModelSpace = new Vec3()
      this.animiatedPosInModelSpace = new Vec3()
    }
}

// MD5骨骼数据结构
export class MD5Joint {
    public name: string; // 骨骼名称
    public parentId: number; // 父亲骨骼的索引号
    public originInModelSpace: Vec3; // 骨骼的原点位置坐标
    public orientationInModelSpace: Quat; // 四元数表示的骨骼朝向
    public bindPoseMatrix: Mat4; // 由origin和orientation合成bindPose,在模型坐标系了
    public inverseBindPoseMatrix: Mat4; // bindPose的逆矩阵，将模型坐标系的顶点变换到joint坐标系
    public constructor () {
      this.name = ''
      this.parentId = -1 // 初始化是索引都指向-1
      this.originInModelSpace = new Vec3()
      this.orientationInModelSpace = new Quat()
      this.bindPoseMatrix = new Mat4()
      this.inverseBindPoseMatrix = new Mat4()
    }
}

// 骨骼动画的权重数据结构
export class MD5Weight {
    public jointId: number; // 当前权重属于哪个骨骼
    public jointWeight: number; // 当前权重的值，[ 0 , 1 ]之间
    public posInJointSpace: Vec3; // 偏移量，相对的是第一帧标准姿态蒙皮的偏移
    public constructor () {
      this.jointId = -1 // 初始化是索引都指向-1
      this.jointWeight = 0
      this.posInJointSpace = new Vec3()
    }
}

export class MD5Mesh {
    public material: string;
    public vertices: MD5Vertex[];
    public indices: number[];
    public weights: MD5Weight[];
    public constructor () {
      this.material = ''
      this.vertices = []
      this.indices = []
      this.weights = []
    }
}
