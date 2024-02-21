import ci from '@tarojs/plugin-mini-ci';
import { IPluginContext } from '@tarojs/service';
import autoPath from 'taro-plugin-auto-path';
import creator from 'taro-plugin-creator';
/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts) => {
  autoPath(ctx, pluginOpts);
  creator(ctx, pluginOpts);
  ctx.addPluginOptsSchema = () => {}; // 强制去除ci插件的参数校验
  ci(ctx, pluginOpts.ciOptions);
};
export { };

