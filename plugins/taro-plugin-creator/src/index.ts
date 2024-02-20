import type { IPluginContext } from '@tarojs/service'
import { CreatorOptions } from './types'
import { Plugin } from './plugin'

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts: CreatorOptions) => {
  new Plugin(ctx, pluginOpts).registerCommand()
}
