"use strict";
exports.__esModule = true;
var SheetsNosql = require("./public_api");
var databaseId = '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI';
exports.databaseId = databaseId;
function load_() {
    return SheetsNosql.sheetsNosql({ databaseId: databaseId });
}
function example1() {
    var DB = load_();
    var object = DB.object('/foo/foo-3');
    Logger.log(object);
}
exports.example1 = example1;
function example2() {
    var DB = load_();
    var list = DB.list('/foo/foo-2/content');
    Logger.log(list);
}
exports.example2 = example2;
function example3() {
    var DB = load_();
    var update = DB.update({
        '/foo/foo-6/content': (new Date()).getTime()
    });
    Logger.log(update);
}
exports.example3 = example3;
