import { setConfig } from '../config'
import { version } from '../config/version'

const makeInstaller = (components:any[] = []) => {
  const apps:any[] = []
  const install = (app:any, opts:any) => {
    const defaultInstallOpt = {
      type: 'frame',
      zIndex: 2e3
    }
    const option = Object.assign(defaultInstallOpt, opts)
    if (apps.includes(app)) { return }
    apps.push(app)
    components.forEach((c) => {
      app.use(c)
    })
    app.config.globalProperties.$layer = option
    setConfig(option)
  }
  return {
    install,
    version
  }
}

export { makeInstaller as default }
