import { IPluginContext } from '@tarojs/service';
import { LogTypeEnum } from './constant';
import { AutoPathConfig, IConfigModel } from './types';
export declare class Plugin {
    readonly ctx: IPluginContext;
    readonly options: AutoPathConfig;
    appConfigModel?: IConfigModel;
    constructor(ctx: IPluginContext, options: AutoPathConfig);
    loadConfig(): Promise<void>;
    log(type: LogTypeEnum, message: string): void;
    watch(): void;
    autoRegister(): Promise<void>;
    onBuildStart(): this;
    registerCommand(): this;
}
