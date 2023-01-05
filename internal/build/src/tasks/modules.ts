import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { epRoot, excludeFiles, pkgRoot } from '@element-plus/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { ElementPlusAlias } from '../plugins/element-plus-alias'
import { buildConfigEntries, target } from '../build-info'

import type { OutputOptions } from 'rollup'

/**
 * 构建输出 ESM 格式的内容
 */
export const buildModules = async () => {
  // 匹配出入口文件列表
  // excludeFiles 只是负责将 glob 匹配到的文件做 exclude 处理
  const input = excludeFiles(
    // 匹配 packages/* 目录下所有的以 js、ts、vue 结尾的文件
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot, // packages/* 目录下
      absolute: true,
      onlyFiles: true,
    })
  )
  // Rollup 多入口打包，执行 rollup 返回 bundle 对象
  const bundle = await rollup({
    input,
    plugins: [
      // Element 主题样式路径更改
      ElementPlusAlias(),
      // 这个插件扩充 Vue 宏和语法糖，比如：defineOptions 就是这个插件支持的
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      // 解决 npm package 的引入问题
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      // commonjs 转换插件
      commonjs(),
      // 完成 TS 转译
      esbuild({
        sourceMap: true, // 开启 sourceMap
        target,
        loaders: {
          '.vue': 'ts', // .vue 文件使用 ts loader 处理
        },
      }),
    ],
    // 要排除的打包序列
    external: await generateExternal({ full: false }),
    // 不用开启 TreeSharking，只需要在业务侧开启即可
    treeshake: false,
  })

  // 输出 bundle
  // Promise.all + bundle.write 完成输出任务
  await writeBundles(
    bundle,
    // 同时打包出 esm、cjs 两种格式的
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true, // 开启后，构建产物将保持与源码一样的文件结构。
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
