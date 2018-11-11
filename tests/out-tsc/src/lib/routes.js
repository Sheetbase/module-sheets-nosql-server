"use strict";
exports.__esModule = true;
exports.ROUTING_ERRORS = {
    'data/unknown': {
        status: 400, message: 'Unknown errors.'
    },
    'data/missing': {
        status: 400, message: 'Missing input.'
    },
    'data/private-data': {
        status: 400, message: 'Can not modify private data.'
    }
};
function routingError(res, code) {
    var error = exports.ROUTING_ERRORS[code] || exports.ROUTING_ERRORS['data/unknown'];
    var status = error.status, message = error.message;
    return res.error(code, message, status);
}
function moduleRoutes(SheetsNosql, options) {
    if (options === void 0) { options = {}; }
    var _a = SheetsNosql.getOptions(), Router = _a.router, disabledRoutes = _a.disabledRoutes;
    var endpoint = options.endpoint || 'data';
    var middlewares = options.middlewares || ([
        function (req, res, next) { return next(); },
    ]);
    if (disabledRoutes.indexOf('get:' + endpoint) < 0) {
        Router.get.apply(Router, ['/' + endpoint].concat(middlewares, [function (req, res) {
                var result;
                try {
                    var path = req.query.path;
                    var type = req.query.type;
                    if (type === 'list') {
                        result = SheetsNosql.list(path);
                    }
                    else {
                        result = SheetsNosql.object(path);
                    }
                }
                catch (code) {
                    return routingError(res, code);
                }
                return res.success(result);
            }]));
    }
    if (disabledRoutes.indexOf('post:' + endpoint) < 0) {
        Router.post.apply(Router, ['/' + endpoint].concat(middlewares, [function (req, res) {
                try {
                    var updates = req.body.updates;
                    SheetsNosql.update(updates);
                }
                catch (code) {
                    return routingError(res, code);
                }
                return res.success({
                    updated: true
                });
            }]));
    }
}
exports.moduleRoutes = moduleRoutes;
