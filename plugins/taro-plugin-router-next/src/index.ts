import { IPluginContext } from '@tarojs/service';
import { Plugin } from './plugin';

export default (ctx: IPluginContext, config: any) => {
  if (process.env.NODE_ENV === 'production') return;
  new Plugin(ctx, config).onBuildStart().registerCommand();
};
