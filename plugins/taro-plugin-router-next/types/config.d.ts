export interface IConfigPackage {
    name: string;
    pagePath: string;
}
export interface IConfig {
    ignore: string[];
    packages: IConfigPackage[];
}
export declare const isDev: boolean;
