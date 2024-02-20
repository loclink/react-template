import { IPluginContext } from '@tarojs/service';
import autoPath from 'taro-plugin-auto-path';
import creator from 'taro-plugin-creator';
/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts) => {
  autoPath(ctx, pluginOpts);
  creator(ctx, pluginOpts);
};
export {};
