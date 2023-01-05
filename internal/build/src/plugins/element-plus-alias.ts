import { PKG_NAME, PKG_PREFIX } from '@element-plus/build-constants'

import type { Plugin } from 'rollup'

export function ElementPlusAlias(): Plugin {
  const themeChalk = 'theme-chalk'
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const // @element-plus/theme-chalk
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const // element-plus/theme-chalk

  return {
    // 插件职责（路径修改）
    name: 'element-plus-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return

      // 以 @element-plus/theme-chalk 开头的路径，将其替换为 element-plus/theme-chalk
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute',
      }
    },
  }
}
