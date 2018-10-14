import { IRouter } from '@sheetbase/core-server';

export interface IOptions {
    databaseId: string;
    router?: IRouter | any;
}