import { ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';
import { ITamotsuxModule } from '@sheetbase/tamotsux-server';
import { IUtilsModule } from '@sheetbase/utils-server';
import { ISheetsNosqlModule, ISheetsNosqlModuleRoutes } from './types/module';

declare const Sheetbase: ISheetbaseModule;
declare const Tamotsux: ITamotsuxModule;
declare const Utils: IUtilsModule;
declare const _;

declare const sheetsNosqlModuleRoutes: ISheetsNosqlModuleRoutes;

export function sheetsNosqlModuleExports(): ISheetsNosqlModule {

    class SheetsNosql {
        // TODO: Custom modifiers

        constructor() {}

        registerRoutes(options: IAddonRoutesOptions = null): void {
            sheetsNosqlModuleRoutes(Sheetbase, this, options);
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
            // TODO: need optimazation
            // TODO: more tests
            // TODO: fix bugs
            // TODO: maybe indexing

            if (!updates) {
                throw new Error('data/no-updates');
            }

            // init tamotsux
            Tamotsux.initialize(SpreadsheetApp.openById(
                Sheetbase.Config.get('databaseId')
            ));
            
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
                _.set(masterData[collectionId], pathSplits, updates[path]);
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



        /**
         * Get data by path
         */
        private get(path: string) {
            if (!path) {
                throw new Error('data/no-path');
            }
            // process the path
            let pathSplits: string[] = path.split('/').filter(Boolean);
            let collectionId: string = pathSplits.shift();
            // TODO: replace with rule based security
            if (collectionId.substr(0, 1) === '_') {
                throw new Error('data/private-data');
            }
            // get master data & return data
            let spreadsheet = SpreadsheetApp.openById(
                Sheetbase.Config.get('databaseId')
            );
            let range = spreadsheet.getRange(collectionId + '!A1:ZZ');
            let values = range.getValues();
            let masterData = this.transform(values);
            return _.get(masterData, pathSplits);
        }


        /**
         * Turn [][] -> [{},{}, ...]
         * @param {Array} values - Data[][]
         * @param {boolean} noHeaders - Has header row?
         */
        private transform(values: any[][], noHeaders: boolean = false) {
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
                    items.push(this.finalize(item));
                }
            }
            return Utils.a2o(items);
        }


        /**
         * Typed modification cell data
         * @param {object} item - Data in JSON
         * @return {object}
         */
        private finalize(item: {[key: string]: any}) {
            for (const key of Object.keys(item)) {
                //transform JSON where possible
                try {
                    item[key] = JSON.parse(item[key]);
                } catch (e) {
                    // continue
                }

                // transform number
                if (!isNaN(item[key]) && Number(item[key]) % 1 === 0) item[key] = parseInt(item[key]);
                if (!isNaN(item[key]) && Number(item[key]) % 1 !== 0) item[key] = parseFloat(item[key]);

                // transform boolean value
                if (typeof item[key] === 'string' || item[key] instanceof String) item[key] = ((item[key]).toLowerCase() === 'true') || ((item[key]).toLowerCase() === 'false' ? false : item[key]);

                // delete null key
                if (item[key] === '' || item[key] === null || item[key] === undefined) {
                    delete item[key];
                }
            }
            return item;
        }

    }

    return new SheetsNosql();
}