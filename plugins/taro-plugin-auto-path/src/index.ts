import type { IPluginContext } from '@tarojs/service'
import { AutoPathConfig } from './types'
import { Plugin } from './plugin'

const defaultOpts: AutoPathConfig = {
  homePath: '',
  mainPackage: {
    root: 'pages',
    tabbarDir: 'tabbar',
  },
  subPackage: {
    root: 'pages-sub',
  },
}

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts: AutoPathConfig) => {
  // pluginOpts = Object.assign(pluginOpts, defaultOpts)
  new Plugin(ctx, pluginOpts).onBuildStart().registerCommand()
}
export { AutoPathConfig }
