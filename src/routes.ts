import { ISheetbaseModule, IRoutingErrors } from '@sheetbase/core-server';
import { ISheetsNosqlModule } from './types/module';

export const SHEETS_NOSQL_ROUTING_ERRORS: IRoutingErrors = {
    'data/no-path': {
        status: 400, message: 'Missing "path" in query.',
    },
    'data/private-data': {
        status: 400, message: 'Can not modify private data.',
    },
    'data/no-updates': {
        status: 400, message: 'Missing "updates" in body.',
    }
};

export function sheetsNosqlRegisterRoutes(Sheetbase: ISheetbaseModule, SheetsNosql: ISheetsNosqlModule) {
    Sheetbase.Router.get('/data', (req, res) => {
        const path: string = req.queries.path;
        const type: string = req.queries.type;
        let data: any[] | {[key: string]: any};
        try {
            if (type === 'list') {
                data = SheetsNosql.list(path);
            } else {
                data = SheetsNosql.object(path);
            }
        } catch (code) {
            const { status, message } = SHEETS_NOSQL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success(data);
    });

    Sheetbase.Router.post('/data', (req, res) => {
        const updates: {[key: string]: any} = req.body.updates;
        try {
            SheetsNosql.update(updates);
        } catch (code) {
            const { status, message } = SHEETS_NOSQL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success({
            updated: true
        });
    });
}