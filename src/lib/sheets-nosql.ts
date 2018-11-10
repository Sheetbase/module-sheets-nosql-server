import { AddonRoutesOptions, UtilsService } from '@sheetbase/core-server';
import { initialize, Table } from '@sheetbase/tamotsux-server';
import get from 'lodash-es/get';
import set from 'lodash-es/set';

import { Options } from './types';
import { sheetsNosqlModuleRoutes } from './routes';

const Utils = new UtilsService();

export class SheetsNosqlService {
    private options: Options;

    // TODO: TODO
    // custom modifiers
    // rule-based security
    // need optimazation
    // more tests
    // fix bugs
    // maybe indexing

    constructor(options: Options) {
        this.options = options;
    }

    registerRoutes(options?: AddonRoutesOptions): void {
        sheetsNosqlModuleRoutes(this, this.options.router, options);
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

        const { databaseId } = this.options;
        // init tamotsux
        initialize(SpreadsheetApp.openById(databaseId));

        // begin updating
        const models = {};
        const masterData = {};
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
                models[collectionId] = Table.define({sheetName: collectionId});
            }
            if (!masterData[collectionId]) {
                masterData[collectionId] = this.get(`/${collectionId}`) || {};
            }

            // update data in memory
            set(masterData[collectionId], pathSplits, updates[path]);
            // load item from sheet
            let item = models[collectionId].where((itemInDB) => {
                return (itemInDB['key'] === docId) ||
                    (itemInDB['slug'] === docId) ||
                    ((itemInDB['id'] + '') === docId) ||
                    ((itemInDB['#'] + '') === docId);
            }).first();
            // update the model
            const dataInMemory = {
                key: docId, slug: docId, id: docId,
                ... masterData[collectionId][docId],
            };
            for (const key of Object.keys(dataInMemory)) {
                if (dataInMemory[key] instanceof Object) {
                    dataInMemory[key] = JSON.stringify(dataInMemory[key]);
                }
            }
            if (item) {
                item = { ... item, ... dataInMemory };
            } else {
                item = models[collectionId].create(dataInMemory);
            }
            // save to sheet
            item.save();
        }

        return true;
    }

    private get(path: string) {
        if (!path) {
            throw new Error('data/missing');
        }
        // process the path
        const pathSplits: string[] = path.split('/').filter(Boolean);
        const collectionId: string = pathSplits.shift();
        // TODO: replace with rule based security
        if (collectionId.substr(0, 1) === '_') {
            throw new Error('data/private-data');
        }
        // get master data & return data

        const { databaseId } = this.options;
        const spreadsheet = SpreadsheetApp.openById(databaseId);
        const range = spreadsheet.getRange(collectionId + '!A1:ZZ');
        const values = range.getValues();
        const masterData = this.transform(values);
        return get(masterData, pathSplits);
    }

    private transform(values: any[][], noHeaders = false) {
        const items: any[] = [];
        let headers: string [] = ['value'];
        let data: any[] = values || [];
        if (!noHeaders) {
            headers = values[0] || [];
            data = values.slice(1, values.length) || [];
        }
        for (let i = 0; i < data.length; i++) {
            const rows = data[i];
            const item = {};
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
