import { provideGlobalConfig } from '@element-plus/hooks'
import { INSTALLED_KEY } from '@element-plus/constants'
import { version } from './version'

import type { App, Plugin } from '@vue/runtime-core'
import type { ConfigProviderContext } from '@element-plus/tokens'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    // 是否注册过了
    if (app[INSTALLED_KEY]) return

    // 标记为注册过了
    app[INSTALLED_KEY] = true

    // 循环组件列表，每个组件都是一个插件，使用 app.use 注册
    components.forEach((c) => app.use(c))

    if (options) provideGlobalConfig(options, app, true)
  }

  return {
    version,
    install,
  }
}
