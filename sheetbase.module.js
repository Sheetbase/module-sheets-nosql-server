var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/sheets-nosql-server
 * Export name: SheetsNosql
 * Description: Using Google Sheets as NoSQL database.
 * Version: 0.0.4
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-sheets-nosql-server.git
 */

function SheetsNosqlModule(options) {
    // import { IRoutingErrors, IAddonRoutesOptions, IRouteHandler, IRouter, IRouteResponse } from '@sheetbase/core-server';
    // import { IModule } from '../index';
    var ROUTING_ERRORS = {
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
        var error = ROUTING_ERRORS[code] || ROUTING_ERRORS['data/unknown'];
        var status = error.status, message = error.message;
        return res.error(code, message, status);
    }
    function sheetsNosqlModuleRoutes(SheetsNosql, Router, options) {
        if (options === void 0) { options = {}; }
        var endpoint = options.endpoint || 'data';
        var middlewares = options.middlewares || ([
            function (req, res, next) { return next(); }
        ]);
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
    // import { IAddonRoutesOptions } from '@sheetbase/core-server';
    // import { Tamotsux } from '@sheetbase/tamotsux-server';
    // import { Utils } from '@sheetbase/utils-server';
    // import { Lodash } from '@sheetbase/lodash-server';
    // import { IOptions } from '../index';
    // import { sheetsNosqlModuleRoutes } from './routes';
    var SheetsNosql = /** @class */ (function () {
        // TODO: TODO
        // custom modifiers
        // rule-based security
        // need optimazation
        // more tests
        // fix bugs
        // maybe indexing
        function SheetsNosql(options) {
            this.init(options);
        }
        SheetsNosql.prototype.init = function (options) {
            this._options = options;
            return this;
        };
        SheetsNosql.prototype.registerRoutes = function (options) {
            sheetsNosqlModuleRoutes(this, this._options.router, options);
        };
        SheetsNosql.prototype.object = function (path) {
            return this.get(path);
        };
        SheetsNosql.prototype.list = function (path) {
            var data = this.get(path);
            return Utils.o2a(data);
        };
        SheetsNosql.prototype.doc = function (collectionId, docId) {
            return this.object("/" + collectionId + "/" + docId);
        };
        SheetsNosql.prototype.collection = function (collectionId) {
            return this.list("/" + collectionId);
        };
        SheetsNosql.prototype.update = function (updates) {
            if (!updates) {
                throw new Error('data/missing');
            }
            var databaseId = this._options.databaseId;
            // init tamotsux
            Tamotsux.initialize(SpreadsheetApp.openById(databaseId));
            // begin updating
            var models = {};
            var masterData = {};
            var _loop_1 = function (path) {
                var pathSplits = path.split('/').filter(Boolean);
                var collectionId = pathSplits.shift();
                var docId = pathSplits[0];
                // private
                if (collectionId.substr(0, 1) === '_') {
                    return "continue";
                }
                if (!docId) {
                    return "continue";
                }
                // models
                if (!models[collectionId]) {
                    models[collectionId] = Tamotsux.Table.define({ sheetName: collectionId });
                }
                if (!masterData[collectionId]) {
                    masterData[collectionId] = this_1.get("/" + collectionId) || {};
                }
                // update data in memory
                Lodash.set(masterData[collectionId], pathSplits, updates[path]);
                // load item from sheet
                var item = models[collectionId].where(function (itemInDB) {
                    return (itemInDB['key'] === docId) ||
                        (itemInDB['slug'] === docId) ||
                        ((itemInDB['id'] + '') === docId) ||
                        ((itemInDB['#'] + '') === docId);
                }).first();
                // update the model
                var dataInMemory = Object.assign({
                    'key': docId, 'slug': docId, 'id': docId
                }, masterData[collectionId][docId]);
                for (var _i = 0, _a = Object.keys(dataInMemory); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (dataInMemory[key] instanceof Object) {
                        dataInMemory[key] = JSON.stringify(dataInMemory[key]);
                    }
                }
                if (item) {
                    item = Object.assign(item, dataInMemory);
                }
                else {
                    item = models[collectionId].create(dataInMemory);
                }
                // save to sheet
                item.save();
            };
            var this_1 = this;
            for (var _i = 0, _a = Object.keys(updates); _i < _a.length; _i++) {
                var path = _a[_i];
                _loop_1(path);
            }
            return true;
        };
        SheetsNosql.prototype.get = function (path) {
            if (!path) {
                throw new Error('data/missing');
            }
            // process the path
            var pathSplits = path.split('/').filter(Boolean);
            var collectionId = pathSplits.shift();
            // TODO: replace with rule based security
            if (collectionId.substr(0, 1) === '_') {
                throw new Error('data/private-data');
            }
            // get master data & return data
            var databaseId = this._options.databaseId;
            var spreadsheet = SpreadsheetApp.openById(databaseId);
            var range = spreadsheet.getRange(collectionId + '!A1:ZZ');
            var values = range.getValues();
            var masterData = this._transform(values);
            return Lodash.get(masterData, pathSplits);
        };
        SheetsNosql.prototype._transform = function (values, noHeaders) {
            if (noHeaders === void 0) { noHeaders = false; }
            var items = [];
            var headers = ['value'];
            var data = values || [];
            if (!noHeaders) {
                headers = values[0] || [];
                data = values.slice(1, values.length) || [];
            }
            for (var i = 0; i < data.length; i++) {
                var rows = data[i];
                var item = {};
                for (var j = 0; j < rows.length; j++) {
                    if (rows[j]) {
                        item[headers[j] || (headers[0] + j)] = rows[j];
                    }
                }
                if (Object.keys(item).length > 0) {
                    items.push(Utils.honorData(item));
                }
            }
            return Utils.a2o(items);
        };
        return SheetsNosql;
    }());
    var moduleExports = new SheetsNosql(options);
    return moduleExports || {};
}
exports.SheetsNosqlModule = SheetsNosqlModule;
// add 'SheetsNosql' to the global namespace
(function (process) {
    process['SheetsNosql'] = SheetsNosqlModule();
})(this);
