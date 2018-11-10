import { Options } from './types';
import { SheetsNosqlService } from './sheets-nosql';

export function sheetsNosql(options: Options): SheetsNosqlService {
    return new SheetsNosqlService(options);
}