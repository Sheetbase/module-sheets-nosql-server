import { ISheetsNosqlModuleConfigs } from './data';

export interface ISheetsNosqlModule {
    init: {(configs: ISheetsNosqlModuleConfigs): void};
    object: {(path: string)};
    list: {(path: string): any[]};
    update: {(updates: {[key: string]: any}): boolean};
}