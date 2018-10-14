import { SheetsNosqlModule } from '../index';

const databaseId = '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI';
const SheetsNosql = SheetsNosqlModule({ databaseId });

export function example1(): void {
    const object = SheetsNosql.object('/foo/foo-3');
    Logger.log(object);
}

export function example2(): void {
    const list = SheetsNosql.list('/foo/foo-2/content');
    Logger.log(list);
}

export function example3(): void {
    const update = SheetsNosql.update({
        '/foo/foo-6/content': (new Date()).getTime()
    });
    Logger.log(update);
}