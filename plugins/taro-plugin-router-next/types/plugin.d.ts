/// <reference types="node" />
import { processTypeEnum } from '@tarojs/helper';
import { IPluginContext } from '@tarojs/service';
import { IPaths } from '@tarojs/service/src/utils/types';
import { IConfig } from './config';
import { Page } from './entitys';
import { Generator } from './generator';
import { Loader } from './loader';
import { FSWatcher } from 'fs';
export declare class Plugin {
    readonly ctx: IPluginContext;
    config: IConfig;
    loader: Loader;
    generator: Generator;
    isWatch: boolean;
    paths: IPaths;
    helper: typeof import('@tarojs/helper');
    watcher: FSWatcher;
    routerWatcher: FSWatcher;
    pages: Page[];
    constructor(ctx: IPluginContext, config: IConfig);
    generateSubPageConfig(pagesSubPath: any, isTabbar?: any): ({
        name: any;
        pagePath: string;
    } | undefined)[];
    getSubConfig(): void;
    onBuildStart(): this;
    registerCommand(): this;
    watch(): void;
    handleGenerator(val: string): Promise<void>;
    start(): void;
    log(type: processTypeEnum, text: string): void;
}
