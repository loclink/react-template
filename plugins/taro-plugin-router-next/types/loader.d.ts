import { Project, SourceFile } from 'ts-morph';
import { IConfigPackage } from './config';
import { ConfigPage, Page } from './entitys';
import { Plugin } from './plugin';
export declare class Loader {
    private readonly root;
    project: Project;
    configPages: ConfigPage[];
    appConfigPath: string;
    appConfig: {
        pages: string[];
        subpackages?: any[];
        subPackages?: any[];
        window: any;
    };
    constructor(root: Plugin);
    loadConfigPages(dynamic?: boolean): void;
    loadPages(): void;
    loadPage(pageDirPath: string, pkg: IConfigPackage): boolean | undefined;
    loadRouteConfig(page: Page, configSourceFile?: SourceFile): void;
    loadMethod(page: Page): void;
}
