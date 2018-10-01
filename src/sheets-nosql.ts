import { ISheetbaseModule } from '@sheetbase/core-server';
import { ITamotsuxModule } from '@sheetbase/tamotsux-server';
import { IUtilsModule } from '@sheetbase/utils-server';
import { ISheetsNosqlModule } from './types/module';
import { ISheetsNosqlModuleConfigs } from './types/data';

declare const Sheetbase: ISheetbaseModule;
declare const Tamotsux: ITamotsuxModule;
declare const Utils: IUtilsModule;
declare const _;

declare const sheetsNosqlRegisterRoutes: {(Sheetbase: ISheetbaseModule, SheetsNosql: ISheetsNosqlModule): void};

export function sheetsNosqlModuleExports(): ISheetsNosqlModule {

    class SheetsNosql {
        private configs: ISheetsNosqlModuleConfigs;

        constructor() {}

        init(configs: ISheetsNosqlModuleConfigs) {
            this.configs = configs;
            // routes
            if (this.configs.exposeRoutes) {
                sheetsNosqlRegisterRoutes(Sheetbase, this);
            }
        }

        // TODO: Custom modifiers

        object(path: string) {
            return this.get(path);
        }

        list(path: string): any[] {
            const data = this.get(path);
            return Utils.o2a(data);
        }

        update(updates: {[key: string]: any}): boolean {
            if (!updates) {
                throw new Error('data/no-updates');
            }

            // init tamotsux
            Tamotsux.initialize(SpreadsheetApp.openById(
                Sheetbase.Config.get('databaseId')
            ));
            
            // begin updating
            let models = {};
            let masterDataGroup = {};
            for (const path of Object.keys(updates)) {
                const pathSplits: string[] = path.split('/').filter(Boolean);
                const masterPath: string = pathSplits.shift();
                const itemId: string = pathSplits[0];

                // private
                if (masterPath.substr(0, 1) === '_') {
                    continue;
                }

                // models
                if (!models[masterPath]) {
                    models[masterPath] = Tamotsux.Table.define({sheetName: masterPath});
                }
                if (!masterDataGroup[masterPath]) {
                    masterDataGroup[masterPath] = this.get(masterPath);
                }
                if (itemId) {
                    // update data in RAM
                    _.set(masterDataGroup[masterPath], pathSplits, updates[path]);
                    // load item from sheet
                    let item = models[masterPath].where(function (itemInDB) {
                        return (itemInDB['key'] === itemId) ||
                            (itemInDB['slug'] === itemId) ||
                            ((itemInDB['id'] + '') === itemId) ||
                            ((itemInDB['#'] + '') === itemId);
                    }).first();
                    // update the model
                    let updatedData = Object.assign({}, masterDataGroup[masterPath][itemId]);
                    for (const key of Object.keys(updatedData)) {
                        if (updatedData[key] instanceof Object) {
                            updatedData[key] = JSON.stringify(updatedData[key]);
                        }
                    }
                    if (item) {
                        Object.assign(item, updatedData);
                    } else {
                        item = models[masterPath].create(updatedData);
                    }
                    // save to sheet
                    item.save();
                }
            }

            return true;
        }



        /**
         * Get data by path
         */
        private get(path) {
            if (!path) {
                throw new Error('data/no-path');
            }
            // process the path
            let pathSplits: string[] = path.split('/').filter(Boolean);
            let masterPath: string = pathSplits.shift();
            // TODO: replace with rule based security
            if (masterPath.substr(0, 1) === '_') {
                throw new Error('data/private-data');
            }
            // get master data & return data
            let spreadsheet = SpreadsheetApp.openById(
                Sheetbase.Config.get('databaseId')
            );
            let range = spreadsheet.getRange(masterPath + '!A1:ZZ');
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