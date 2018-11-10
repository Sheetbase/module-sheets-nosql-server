import { RouterService } from '@sheetbase/core-server';

export interface Options {
    databaseId: string;
    router?: RouterService | any;
}