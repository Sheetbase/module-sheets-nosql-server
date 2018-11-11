"use strict";
exports.__esModule = true;
// tslint:disable:no-unused-expression
var chai_1 = require("chai");
var mocha_1 = require("mocha");
var public_api_1 = require("../src/public_api");
var example_1 = require("../src/example");
var SheetsNosql = public_api_1.sheetsNosql({ databaseId: example_1.databaseId });
mocha_1.describe('Sheets Nosql module test', function () {
    mocha_1.it('SheetsNosql service should be created', function () {
        chai_1.expect(SheetsNosql).to.be.not["null"];
    });
});
