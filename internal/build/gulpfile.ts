import path from 'path'
import { copyFile, mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  epOutput,
  epPackage,
  projRoot,
} from '@element-plus/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'
import type { TaskFunction } from 'gulp'
import type { Module } from './src'

export const copyFiles = () =>
  Promise.all([
    // 拷贝 packages/element-plus/package.json
    copyFile(epPackage, path.join(epOutput, 'package.json')),
    // 拷贝 README
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(epOutput, 'README.md')
    ),
    // 拷贝 global.d.ts
    copyFile(
      path.resolve(projRoot, 'global.d.ts'),
      path.resolve(epOutput, 'global.d.ts')
    ),
  ])

// 将 dist/types 下的 类型声明文件都拷贝到 dist/element-plus/es or lib 下
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}

/**
 * 串联执行任务
 */
export default series(
  // 清空项目 dist 文件夹
  // withTaskName('clean', () => run('pnpm run clean')),
  // 创建 dist/element-plus 目录
  // withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),
  // 并行执行如下任务
  parallel(
    // 构建 ESM 格式的输出
    // runTask('buildModules')
    // // 构建完整模式的代码
    // runTask('buildFullBundle')
    // // 生成 TS 类型声明文件
    // runTask('generateTypesDefinitions')
    runTask('buildHelper')
    // series(
    //   // 构建主题
    //   withTaskName('buildThemeChalk', () =>
    //     run('pnpm run -C packages/theme-chalk build')
    //   ),
    //   // 拷贝完整的样式
    //   copyFullStyle
    // )
  )
  // 并行执行如下任务
  // parallel(copyTypesDefinitions, copyFiles)
)

// 对应的构建任务的处理函数划分为模块 export 导出给 gulp 工具来处理
// 这就是为什么能执行：pnpm run start buildModules 的原因
export * from './src'
