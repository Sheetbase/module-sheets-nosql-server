import { IModule as ISheetbaseModule, IRoutingErrors, IAddonRoutesOptions, IHttpHandler } from '@sheetbase/core-server';
import { IModule } from './types/module';

export const SHEETS_NOSQL_ROUTING_ERRORS: IRoutingErrors = {
    'data/unknown': {
        status: 400, message: 'Unknown errors.',
    },
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

export function sheetsNosqlModuleRoutes(
    Sheetbase: ISheetbaseModule,
    SheetsNosql: IModule,
    options: IAddonRoutesOptions = {}
): void {
    const customName: string = options.customName || 'data';
    const middlewares: IHttpHandler[] = options.middlewares || ([
        (req, res, next) => next()
    ]);

    Sheetbase.Router.get('/' + customName, ... middlewares, (req, res) => {
        const path: string = req.queries['path'];
        const type: string = req.queries['type'];
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

    Sheetbase.Router.post('/' + customName, ... middlewares, (req, res) => {
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