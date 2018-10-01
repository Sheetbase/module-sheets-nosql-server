import { ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';

export interface ISheetsNosqlModule {
    registerRoutes: {(options?: IAddonRoutesOptions): void};
    object: {(path: string)};
    list: {(path: string): any[]};
    doc: {(collectionId: string, docId: string)};
    collection: {(collectionId: string): any[]};
    update: {(updates: {[key: string]: any}): boolean};
}

export interface ISheetsNosqlModuleRoutes {
    (
        Sheetbase: ISheetbaseModule,
        SheetsNosql: ISheetsNosqlModule,
        options?: IAddonRoutesOptions
    ): void;
}