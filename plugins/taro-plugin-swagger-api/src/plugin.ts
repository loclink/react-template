import { IPluginContext } from '@tarojs/service';
import { CreatorOptions } from './types';
import { LogTypeEnum } from './constant';
import * as path from 'path';
import { generateApi } from 'swagger-typescript-api';

export class Plugin {
  constructor(public readonly ctx: IPluginContext, public readonly options: CreatorOptions) {}

  log(type: LogTypeEnum, message: string) {
    this.ctx.helper.printLog(type as any, message);
  }

  registerCommand() {
    this.ctx.registerCommand({
      name: 'api',
      synopsisList: ['taro api     (生成api接口代码)'],
      fn: async () => {
        generateApi({
          name: 'http.ts',
          url: 'http://localhost:3000/weapp/docs-json',
          output: path.resolve(this.ctx.paths.sourcePath, './request/api'),
          templates: path.resolve(__dirname, '../api-templates/'),
          silent: true,
          // generateRouteTypes: true,
          // httpClientType: 'taro',
          // generateClient: false,
          extractRequestParams: true,
          extractRequestBody: true,
          cleanOutput: true
        }).then(() => {
          this.log(LogTypeEnum.GENERATE, 'api文件已生成');
        });
      }
    });
  }
}
