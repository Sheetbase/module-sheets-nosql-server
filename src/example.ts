import * as SheetsNosql from './public_api';

const DATABASE_ID = '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI';

function load_() {
    return SheetsNosql.sheetsNosql({
        databaseId: DATABASE_ID,
    });
}

export function example1(): void {
    const DB = load_();

    const object = DB.object('/foo/foo-3');
    Logger.log(object);
}

export function example2(): void {
    const DB = load_();

    const list = DB.list('/foo/foo-2/content');
    Logger.log(list);
}

export function example3(): void {
    const DB = load_();

    const update = DB.update({
        '/foo/foo-6/content': (new Date()).getTime(),
    });
    Logger.log(update);
}

export { DATABASE_ID };