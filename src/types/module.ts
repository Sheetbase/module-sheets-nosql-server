import { IModule as ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';

export interface IModule {    
    init(Sheetbase: ISheetbaseModule): IModule;
    registerRoutes(options?: IAddonRoutesOptions): void;
    object(path: string);
    list(path: string): any[];
    doc(collectionId: string, docId: string);
    collection(collectionId: string): any[];
    update(updates: {[key: string]: any}): boolean;
}
