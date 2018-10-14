import { IRoutingErrors, IAddonRoutesOptions, IRouteHandler, IRouter, IRouteResponse } from '@sheetbase/core-server';

import { IModule } from '../index';

export const ROUTING_ERRORS: IRoutingErrors = {
    'data/unknown': {
        status: 400, message: 'Unknown errors.',
    },
    'data/missing': {
        status: 400, message: 'Missing input.',
    },
    'data/private-data': {
        status: 400, message: 'Can not modify private data.',
    }
};

function routingError(res: IRouteResponse, code: string) {
    const error = ROUTING_ERRORS[code] || ROUTING_ERRORS['data/unknown'];
    const { status, message } = error;
    return res.error(code, message, status);
}

export function sheetsNosqlModuleRoutes(SheetsNosql: IModule, Router: IRouter, options: IAddonRoutesOptions = {}): void {
    const endpoint: string = options.endpoint || 'data';
    const middlewares: IRouteHandler[] = options.middlewares || ([
        (req, res, next) => next()
    ]);

    Router.get('/' + endpoint, ... middlewares, (req, res) => {
        let result: any[] | {[key: string]: any};
        try {
            const path: string = req.query.path;
            const type: string = req.query.type;
            if (type === 'list') {
                result = SheetsNosql.list(path);
            } else {
                result = SheetsNosql.object(path);
            }
        } catch (code) {
            return routingError(res, code);
        }
        return res.success(result);
    });

    Router.post('/' + endpoint, ... middlewares, (req, res) => {
        try {
            const updates: {[key: string]: any} = req.body.updates;
            SheetsNosql.update(updates);
        } catch (code) {
            return routingError(res, code);
        }
        return res.success({
            updated: true
        });
    });
}