/**
 * 
 * Name: @sheetbase/sheets-nosql-server
 * Description: Using Google Sheets as NoSQL database.
 * Version: 0.0.2
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-sheets-nosql-server.git
 *
 */

import { ISheetbaseModule } from '@sheetbase/core-server';
import { ISheetsNosqlModule } from './types/module';

declare const Sheetbase: ISheetbaseModule;

declare const sheetsNosqlModuleExports: {(): ISheetsNosqlModule};
const sheetsNosql = sheetsNosqlModuleExports();
const SheetsNosql = sheetsNosql;

for (const prop of Object.keys({... sheetsNosql, ... Object.getPrototypeOf(sheetsNosql)})) {
	this[prop] = sheetsNosql[prop];
}

export { sheetsNosql, SheetsNosql };

export function sheetbase_sheetsNosql_example1(): void {
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    const object = SheetsNosql.object('/foo/foo-3');
    Logger.log(object);
}

export function sheetbase_sheetsNosql_example2(): void {
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    const list = SheetsNosql.list('/foo/foo-2/content');
    Logger.log(list);
}

export function sheetbase_sheetsNosql_example3(): void {
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    const update = SheetsNosql.update({
        '/foo/foo-6/content': (new Date()).getTime()
    });
    Logger.log(update);
}