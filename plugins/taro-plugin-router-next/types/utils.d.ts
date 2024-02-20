import { VariableDeclaration } from "ts-morph";
export declare function extractValue(options: {
    name: string;
    declaration: VariableDeclaration;
}): string;
export declare function formatPageDir(dirName: string): string;
export declare function isNil(val: any): boolean;
