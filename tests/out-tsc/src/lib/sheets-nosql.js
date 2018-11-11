"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var core_server_1 = require("@sheetbase/core-server");
var tamotsux_server_1 = require("@sheetbase/tamotsux-server");
var get_1 = require("lodash-es/get");
var set_1 = require("lodash-es/set");
var routes_1 = require("./routes");
var SheetsNosqlService = /** @class */ (function () {
    // TODO: TODO
    // custom modifiers
    // rule-based security
    // need optimazation
    // more tests
    // fix bugs
    // maybe indexing
    function SheetsNosqlService(options) {
        this.options = options;
    }
    SheetsNosqlService.prototype.getOptions = function () {
        return this.options;
    };
    SheetsNosqlService.prototype.registerRoutes = function (options) {
        return routes_1.moduleRoutes(this, options);
    };
    SheetsNosqlService.prototype.object = function (path) {
        return this.get(path);
    };
    SheetsNosqlService.prototype.doc = function (collectionId, docId) {
        return this.object("/" + collectionId + "/" + docId);
    };
    SheetsNosqlService.prototype.list = function (path) {
        var data = this.get(path);
        return core_server_1.o2a(data);
    };
    SheetsNosqlService.prototype.collection = function (collectionId) {
        return this.list("/" + collectionId);
    };
    SheetsNosqlService.prototype.update = function (updates) {
        if (!updates) {
            throw new Error('data/missing');
        }
        var databaseId = this.options.databaseId;
        // init tamotsux
        tamotsux_server_1.initialize(SpreadsheetApp.openById(databaseId));
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
                models[collectionId] = tamotsux_server_1.Table.define({ sheetName: collectionId });
            }
            if (!masterData[collectionId]) {
                masterData[collectionId] = this_1.get("/" + collectionId) || {};
            }
            // update data in memory
            set_1["default"](masterData[collectionId], pathSplits, updates[path]);
            // load item from sheet
            var item = models[collectionId].where(function (itemInDB) {
                return (itemInDB['key'] === docId) ||
                    (itemInDB['slug'] === docId) ||
                    ((itemInDB['id'] + '') === docId) ||
                    ((itemInDB['#'] + '') === docId);
            }).first();
            // update the model
            var dataInMemory = __assign({ key: docId, slug: docId, id: docId }, masterData[collectionId][docId]);
            for (var _i = 0, _a = Object.keys(dataInMemory); _i < _a.length; _i++) {
                var key = _a[_i];
                if (dataInMemory[key] instanceof Object) {
                    dataInMemory[key] = JSON.stringify(dataInMemory[key]);
                }
            }
            if (item) {
                item = __assign({}, item, dataInMemory);
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
    SheetsNosqlService.prototype.get = function (path) {
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
        var databaseId = this.options.databaseId;
        var spreadsheet = SpreadsheetApp.openById(databaseId);
        var range = spreadsheet.getRange(collectionId + '!A1:ZZ');
        var values = range.getValues();
        var masterData = this.transform(values);
        return get_1["default"](masterData, pathSplits);
    };
    SheetsNosqlService.prototype.transform = function (values, noHeaders) {
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
                items.push(core_server_1.honorData(item));
            }
        }
        return core_server_1.a2o(items);
    };
    return SheetsNosqlService;
}());
exports.SheetsNosqlService = SheetsNosqlService;
