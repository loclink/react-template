/// <reference types="node" />
import { Project, SourceFile } from 'ts-morph';
import { Plugin } from './plugin';
export declare class Generator {
    private readonly root;
    project: Project;
    routerSourceFile: SourceFile;
    targetModulePath: string;
    constructor(root: Plugin);
    emitTimer: NodeJS.Timeout;
    emit(force?: boolean): void;
    generateMethods(): string;
}
