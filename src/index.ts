import { IModule, IOptions } from '../index';
import { SheetsNosql } from './sheets-nosql';

export declare const SheetsNosqlModule: {(options: IOptions): IModule};

declare const options: IOptions;
export const moduleExports: IModule = new SheetsNosql(options);