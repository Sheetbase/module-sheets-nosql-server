import { IAddonRoutesOptions } from '@sheetbase/core-server';
import { Tamotsux } from '@sheetbase/tamotsux-server';
import { Utils } from '@sheetbase/utils-server';
import { Lodash } from '@sheetbase/lodash-server';

import { IOptions } from '../index';
import { sheetsNosqlModuleRoutes } from './routes';

export class SheetsNosql {
    private _options: IOptions;

    // TODO: TODO
    // custom modifiers
    // rule-based security
    // need optimazation
    // more tests
    // fix bugs
    // maybe indexing

    constructor(options: IOptions) {
        this.init(options);
    }
    
    init(options: IOptions) {
        this._options = options;
        return this;
    }

    registerRoutes(options?: IAddonRoutesOptions): void {
        sheetsNosqlModuleRoutes(this, this._options.router, options);
    }

    object(path: string) {
        return this.get(path);
    }
    list(path: string): any[] {
        const data = this.get(path);
        return Utils.o2a(data);
    }

    doc(collectionId: string, docId: string) {
        return this.object(`/${collectionId}/${docId}`);
    }        
    collection(collectionId: string): any[] {
        return this.list(`/${collectionId}`);
    }

    update(updates: {[key: string]: any}): boolean {
        if (!updates) {
            throw new Error('data/missing');
        }

        const { databaseId } = this._options;
        // init tamotsux
        Tamotsux.initialize(SpreadsheetApp.openById(databaseId));
        
        // begin updating
        let models = {};
        let masterData = {};
        for (const path of Object.keys(updates)) {
            const pathSplits: string[] = path.split('/').filter(Boolean);
            const collectionId: string = pathSplits.shift();
            const docId: string = pathSplits[0];

            // private
            if (collectionId.substr(0, 1) === '_') {
                continue;
            }                
            if (!docId) {
                continue;
            }

            // models
            if (!models[collectionId]) {
                models[collectionId] = Tamotsux.Table.define({sheetName: collectionId});
            }
            if (!masterData[collectionId]) {
                masterData[collectionId] = this.get(`/${collectionId}`) || {};
            }

            // update data in memory
            Lodash.set(masterData[collectionId], pathSplits, updates[path]);
            // load item from sheet
            let item = models[collectionId].where(function (itemInDB) {
                return (itemInDB['key'] === docId) ||
                    (itemInDB['slug'] === docId) ||
                    ((itemInDB['id'] + '') === docId) ||
                    ((itemInDB['#'] + '') === docId);
            }).first();
            // update the model
            let dataInMemory = Object.assign({
                'key': docId, 'slug': docId, 'id': docId
            }, masterData[collectionId][docId]);
            for (const key of Object.keys(dataInMemory)) {
                if (dataInMemory[key] instanceof Object) {
                    dataInMemory[key] = JSON.stringify(dataInMemory[key]);
                }
            }
            if (item) {
                item = Object.assign(item, dataInMemory);
            } else {
                item = models[collectionId].create(dataInMemory);
            }
            // save to sheet
            item.save();
        }

        return true;
    }

    get(path: string) {
        if (!path) {
            throw new Error('data/missing');
        }
        // process the path
        let pathSplits: string[] = path.split('/').filter(Boolean);
        let collectionId: string = pathSplits.shift();
        // TODO: replace with rule based security
        if (collectionId.substr(0, 1) === '_') {
            throw new Error('data/private-data');
        }
        // get master data & return data
        
        const { databaseId } = this._options;
        let spreadsheet = SpreadsheetApp.openById(databaseId);
        let range = spreadsheet.getRange(collectionId + '!A1:ZZ');
        let values = range.getValues();
        let masterData = this._transform(values);
        return Lodash.get(masterData, pathSplits);
    }

    private _transform(values: any[][], noHeaders: boolean = false) {
        let items: any[] = [];
        let headers: string [] = ['value'];
        let data: any[] = values || [];
        if (!noHeaders) {
            headers = values[0] || [];
            data = values.slice(1, values.length) || [];
        }
        for (let i = 0; i < data.length; i++) {
            let rows = data[i];
            let item = {};
            for (let j = 0; j < rows.length; j++) {
                if (rows[j]) {
                    item[headers[j] || (headers[0] + j)] = rows[j];
                }
            }
            if (Object.keys(item).length > 0) {
                items.push(Utils.honorData(item));
            }
        }
        return Utils.a2o(items);
    }

}
