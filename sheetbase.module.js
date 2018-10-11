var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/sheets-nosql-server
 * Export name: SheetsNosql
 * Description: Using Google Sheets as NoSQL database.
 * Version: 0.0.3
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-sheets-nosql-server.git
 */

function SheetsNosqlModule() {
    // import { IModule as ISheetbaseModule, IRoutingErrors, IAddonRoutesOptions, IHttpHandler } from '@sheetbase/core-server';
    // import { IModule } from './types/module';
    var SHEETS_NOSQL_ROUTING_ERRORS = {
        'data/unknown': {
            status: 400, message: 'Unknown errors.'
        },
        'data/no-path': {
            status: 400, message: 'Missing "path" in query.'
        },
        'data/private-data': {
            status: 400, message: 'Can not modify private data.'
        },
        'data/no-updates': {
            status: 400, message: 'Missing "updates" in body.'
        }
    };
    function sheetsNosqlModuleRoutes(Sheetbase, SheetsNosql, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        var customName = options.customName || 'data';
        var middlewares = options.middlewares || ([
            function (req, res, next) { return next(); }
        ]);
        (_a = Sheetbase.Router).get.apply(_a, ['/' + customName].concat(middlewares, [function (req, res) {
                var path = req.queries['path'];
                var type = req.queries['type'];
                var data;
                try {
                    if (type === 'list') {
                        data = SheetsNosql.list(path);
                    }
                    else {
                        data = SheetsNosql.object(path);
                    }
                }
                catch (code) {
                    var _a = SHEETS_NOSQL_ROUTING_ERRORS[code], status = _a.status, message = _a.message;
                    return res.error(code, message, status);
                }
                return res.success(data);
            }]));
        (_b = Sheetbase.Router).post.apply(_b, ['/' + customName].concat(middlewares, [function (req, res) {
                var updates = req.body.updates;
                try {
                    SheetsNosql.update(updates);
                }
                catch (code) {
                    var _a = SHEETS_NOSQL_ROUTING_ERRORS[code], status = _a.status, message = _a.message;
                    return res.error(code, message, status);
                }
                return res.success({
                    updated: true
                });
            }]));
    }
    var SheetsNosql = /** @class */ (function () {
        // TODO: Custom modifiers
        function SheetsNosql() {
        }
        SheetsNosql.prototype.init = function (Sheetbase) {
            this._Sheetbase = Sheetbase;
            return this;
        };
        SheetsNosql.prototype.registerRoutes = function (options) {
            sheetsNosqlModuleRoutes(this._Sheetbase, this, options);
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
            // TODO: need optimazation
            // TODO: more tests
            // TODO: fix bugs
            // TODO: maybe indexing
            if (!updates) {
                throw new Error('data/no-updates');
            }
            // init tamotsux
            Tamotsux.initialize(SpreadsheetApp.openById(this._Sheetbase.Config.get('databaseId')));
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
                throw new Error('data/no-path');
            }
            // process the path
            var pathSplits = path.split('/').filter(Boolean);
            var collectionId = pathSplits.shift();
            // TODO: replace with rule based security
            if (collectionId.substr(0, 1) === '_') {
                throw new Error('data/private-data');
            }
            // get master data & return data
            var spreadsheet = SpreadsheetApp.openById(this._Sheetbase.Config.get('databaseId'));
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
    // import { IModule } from './types/module';
    // import { SheetsNosql } from './sheets-nosql';
    var moduleExports = new SheetsNosql();
    return moduleExports || {};
}
exports.SheetsNosqlModule = SheetsNosqlModule;
// add to the global namespace
var proccess = proccess || this;
proccess['SheetsNosql'] = SheetsNosqlModule();
