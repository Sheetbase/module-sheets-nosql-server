import {
    RoutingErrors,
    AddonRoutesOptions,
    RouteHandler,
    RouteResponse,
} from '@sheetbase/core-server';

import { SheetsNosqlService } from './sheets-nosql';

export const ROUTING_ERRORS: RoutingErrors = {
    'data/unknown': {
        status: 400, message: 'Unknown errors.',
    },
    'data/missing': {
        status: 400, message: 'Missing input.',
    },
    'data/private-data': {
        status: 400, message: 'Can not modify private data.',
    },
};

function routingError(res: RouteResponse, code: string) {
    const error = ROUTING_ERRORS[code] || ROUTING_ERRORS['data/unknown'];
    const { status, message } = error;
    return res.error(code, message, status);
}

export function moduleRoutes(
    SheetsNosql: SheetsNosqlService,
    options: AddonRoutesOptions = {},
): void {
    const { router: Router, disabledRoutes } = SheetsNosql.getOptions();

	if (!Router) {
        throw new Error('No router, please check out for Sheetbase Router.');
    }
    const endpoint: string = options.endpoint || 'data';
    const middlewares: RouteHandler[] = options.middlewares || ([
        (req, res, next) => next(),
    ]);

    if (disabledRoutes.indexOf('get:' + endpoint) < 0) {
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
    }

    if (disabledRoutes.indexOf('post:' + endpoint) < 0) {
        Router.post('/' + endpoint, ... middlewares, (req, res) => {
            try {
                const updates: {[key: string]: any} = req.body.updates;
                SheetsNosql.update(updates);
            } catch (code) {
                return routingError(res, code);
            }
            return res.success({
                updated: true,
            });
        });
    }
}