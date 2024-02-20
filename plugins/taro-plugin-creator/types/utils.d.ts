import { IPluginContext } from '@tarojs/service';
import { CreatorOptions } from './types';
/**
 *
 * @param componentName 页面
 * @param componentDir   页面目录
 * @param cssExt:文件后缀
 * @param log 日志工具
 */
export declare function PageGenerator(ctx: IPluginContext, pagePath: string, pageName: string): void;
export declare const generatorMainPackagePage: (ctx: IPluginContext, pagePath: string, options: CreatorOptions) => void;
export declare const generatorSubPackagePage: (ctx: IPluginContext, pagePath: string, options: CreatorOptions) => void;
export declare const generatorTabBarPage: (ctx: IPluginContext, pagePath: string, options: CreatorOptions) => void;
export declare function toCamelCase(str: string, capitalizeFirstLetter?: boolean): string;
export declare function validPath(str: string): boolean;
export declare function getPagesPath(ctx: IPluginContext, options: CreatorOptions): string;
