import { IModule as ISheetbaseModule } from '@sheetbase/core-server';
import { IModule } from './types/module';

declare const Sheetbase: ISheetbaseModule;

var proccess = proccess || this;
declare const SheetsNosqlModule: {(): IModule};
const SheetsNosql: IModule = proccess['SheetsNosql'] || SheetsNosqlModule();

export function example1(): void {
    const Database = SheetsNosql.init(Sheetbase);
    // for demo
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    // get data
    const object = Database.object('/foo/foo-3');
    Logger.log(object);
}

export function example2(): void {
    const Database = SheetsNosql.init(Sheetbase);
    // for demo
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    // get data
    const list = Database.list('/foo/foo-2/content');
    Logger.log(list);
}

export function example3(): void {
    const Database = SheetsNosql.init(Sheetbase);
    // for demo
    Sheetbase.Config.set('databaseId', '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
    // update data
    const update = Database.update({
        '/foo/foo-6/content': (new Date()).getTime()
    });
    Logger.log(update);
}