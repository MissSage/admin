import { NOOP } from '@vue/shared'
export const withInstall = (main:any, extra:any) => {
  main.install = (app:any) => {
    for (const comp of [
      main,
      ...Object.values(extra !== null && extra !== undefined ? extra : {})
    ]) {
      app.component(comp.name, comp)
    }
  }
  if (extra) {
    for (const [
      key,
      comp
    ] of Object.entries(extra)) {
      main[key] = comp
    }
  }
  return main
}
export const withInstallFunction = (fn:any, name:any) => {
  fn.install = (app:any) => {
    app.config.globalProperties[name] = fn
  }
  return fn
}
export const withNoopInstall = (component:any) => {
  component.install = NOOP
  return component
}
