import { buildRoot } from '@element-plus/build-utils'
import { run } from './process'

import type { TaskFunction } from 'gulp'

/**
 * 往函数上扩展一个 displayName 属性
 * @param name 任务名称
 * @param fn 任务函数
 * @returns
 */
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

/**
 * 执行某项任务
 * @param name 任务名称
 * @returns
 * eg: buildModules => pnpm run start buildModules
 */
export const runTask = (name: string) =>
  // withTaskName 包裹 shellTask
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )
