import { IPluginContext } from '@tarojs/service';
import { CreatorOptions } from './types';
import { LogTypeEnum } from './constant';
export declare class Plugin {
    readonly ctx: IPluginContext;
    readonly options: CreatorOptions;
    constructor(ctx: IPluginContext, options: CreatorOptions);
    log(type: LogTypeEnum, message: string): void;
    registerCommand(): void;
}
