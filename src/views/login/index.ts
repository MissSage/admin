export const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    {
      min: 8,
      max: 20,
      trigger: 'blur',
      message: '密码长度应该在8到20之间'
    }
  ]
}
