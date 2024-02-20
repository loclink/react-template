export declare class Page {
    dirName: string;
    dirPath: string;
    path: string;
    fullPath: string;
    packageName: string;
    routeConfig?: RouteConfig;
    method?: PageMethod;
}
export declare class PageMethod {
    name: string;
    type: string;
    value: string;
}
export declare class RouteConfig {
    params?: string;
    data?: string;
    ext?: string;
}
export declare class ConfigPage {
    packageName: string;
    packageRoot: string;
    path: string;
    fullPath: string;
}
