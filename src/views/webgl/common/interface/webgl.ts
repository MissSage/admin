/**
 * 着色器类型枚举类
 */
export enum EShaderType
{
  /**
   * 顶点着色器
   */
    VS_SHADER,
    /**
     * 片段着色器
     */
    FS_SHADER
}
/**
 * 重新定义的完整的GLSL ES 数据类型枚举
 */
export enum EGLSLESDataType
{
    FLOAT_VEC2 = 0x8B50,
    FLOAT_VEC3,
    FLOAT_VEC4,
    INT_VEC2,
    INT_VEC3,
    INT_VEC4,
    BOOL,
    BOOL_VEC2,
    BOOL_VEC3,
    BOOL_VEC4,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    SAMPLER_2D,
    SAMPLER_CUBE,

    FLOAT = 0x1406,
    INT = 0x1404
}
