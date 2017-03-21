import { Promise } from 'es6-promise';
export declare function esriBootstrap(url?: string, dojoConfig?: {
    [propName: string]: any;
}): Promise<any>;
export declare function esriPromise(modules: string[]): Promise<any>;
export default esriPromise;
