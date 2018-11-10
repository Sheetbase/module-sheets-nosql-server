(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('handlebars'), require('ejs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'handlebars', 'ejs'], factory) :
    (factory((global.SheetsNosql = {}),global.handlebars,global.ejs));
}(this, (function (exports,handlebars,ejs) { 'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
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

    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };

    var UtilsService = /** @class */ (function () {
        function UtilsService() {
        }
        UtilsService.prototype.o2a = function (object, keyName) {
            if (keyName === void 0) { keyName = '$key'; }
            var array = [];
            for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
                var key = _a[_i];
                if (object[key] instanceof Object) {
                    object[key][keyName] = key;
                }
                else {
                    var value = object[key];
                    object[key] = {};
                    object[key][keyName] = key;
                    object[key]['value'] = value;
                }
                array.push(object[key]);
            }
            return array;
        };
        UtilsService.prototype.a2o = function (array, keyName) {
            if (keyName === void 0) { keyName = 'key'; }
            var object = {};
            for (var i = 0; i < (array || []).length; i++) {
                var item = array[i];
                object[item[keyName] ||
                    item['slug'] ||
                    (item['id'] ? '' + item['id'] : null) ||
                    (item['#'] ? '' + item['#'] : null) ||
                    ('' + Math.random() * 1E20)] = item;
            }
            return object;
        };
        UtilsService.prototype.uniqueId = function (length, startWith) {
            if (length === void 0) { length = 12; }
            if (startWith === void 0) { startWith = '-'; }
            var maxLoop = length - 8;
            var ASCII_CHARS = startWith + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
            var lastPushTime = 0;
            var lastRandChars = [];
            var now = new Date().getTime();
            var duplicateTime = (now === lastPushTime);
            lastPushTime = now;
            var timeStampChars = new Array(8);
            var i;
            for (i = 7; i >= 0; i--) {
                timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
                now = Math.floor(now / 64);
            }
            var uid = timeStampChars.join('');
            if (!duplicateTime) {
                for (i = 0; i < maxLoop; i++) {
                    lastRandChars[i] = Math.floor(Math.random() * 64);
                }
            }
            else {
                for (i = maxLoop - 1; i >= 0 && lastRandChars[i] === 63; i--) {
                    lastRandChars[i] = 0;
                }
                lastRandChars[i]++;
            }
            for (i = 0; i < maxLoop; i++) {
                uid += ASCII_CHARS.charAt(lastRandChars[i]);
            }
            return uid;
        };
        UtilsService.prototype.honorData = function (data) {
            if (data === void 0) { data = {}; }
            for (var key in data) {
                if (data[key] === '' || data[key] === null || data[key] === undefined) {
                    // delete null key
                    delete data[key];
                }
                else if ((data[key] + '').toLowerCase() === 'true') {
                    // boolean TRUE
                    data[key] = true;
                }
                else if ((data[key] + '').toLowerCase() === 'false') {
                    // boolean FALSE
                    data[key] = false;
                }
                else if (!isNaN(data[key])) {
                    // number
                    if (Number(data[key]) % 1 === 0) {
                        // tslint:disable-next-line:ban
                        data[key] = parseInt(data[key], 2);
                    }
                    if (Number(data[key]) % 1 !== 0) {
                        // tslint:disable-next-line:ban
                        data[key] = parseFloat(data[key]);
                    }
                }
                else {
                    // JSON
                    try {
                        data[key] = JSON.parse(data[key]);
                    }
                    catch (e) {
                        // continue
                    }
                }
            }
            return data;
        };
        return UtilsService;
    }());

    // tslint:disable:only-arrow-functions forin max-line-length
    /**
     * Sheetbase Modifications
     * This file was modified by Sheetbase.
     * See: <sheetbase>...</sheetbase>
     *
     */
    /**
     * FILE: src/extenstions/extension.js
     */
    if (typeof Object.assign !== 'function') {
        (function () {
            Object.assign = function (target) {
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }
    /**
     * FILE: src/models/Relation_.js
     */
    var createRelation_ = function () {
        var Relation_ = function (TableClass) {
            this.Table = TableClass;
            this.predicates = [];
        };
        Object.defineProperties(Relation_.prototype, {
            where: { value: function (predicate) {
                    this.predicates.push(predicate);
                    return this;
                } },
            all: { value: function () {
                    var records = [];
                    var that = this;
                    this.Table.allValues().forEach(function (values, i) {
                        var record = new that.Table(that.Table.objectFrom(values), { row_: i + 2 });
                        var passed = true;
                        for (var i_1 = 0; i_1 < that.predicates.length; i_1++) {
                            passed = passed && evaluate(that.predicates[i_1], record);
                            if (!passed)
                                break;
                        }
                        if (passed)
                            records.push(record);
                    });
                    if (!this.comparator)
                        return records;
                    return compare(this.comparator, records);
                } },
            first: { value: function () {
                    var records = this.all();
                    return records.length > 0 ? records[0] : null;
                } },
            last: { value: function () {
                    var records = this.all();
                    return records.length > 0 ? records[records.length - 1] : null;
                } },
            pluck: { value: function (column) {
                    var result = [];
                    this.all().forEach(function (record) {
                        result.push(record[column]);
                    });
                    return result;
                } },
            sum: { value: function (column) {
                    var total = 0;
                    this.all().forEach(function (record) {
                        total += Number(record[column]);
                    });
                    return total;
                } },
            max: { value: function (column) {
                    return Math.max.apply(null, this.pluck(column));
                } },
            min: { value: function (column) {
                    return Math.min.apply(null, this.pluck(column));
                } },
            order: { value: function (comparator) {
                    this.comparator = comparator;
                    return this;
                } }
        });
        var evaluate = function (predicate, record) {
            var t = typeof predicate;
            if (t === 'function') {
                return predicate(record);
            }
            else if (t === 'object') {
                return evaludateAsObject(predicate, record);
            }
            else {
                throw new Error('Invalid where condition [' + predicate + ']');
            }
        };
        var evaludateAsObject = function (object, record) {
            var passed = true;
            for (var attr in object) {
                passed = passed && record[attr] === object[attr];
                if (!passed)
                    return false;
            }
            return true;
        };
        var compare = function (comparator, records) {
            var t = typeof comparator;
            if (t === 'function')
                return records.sort(comparator);
            if (t === 'string')
                return records.sort(createComparator(comparator));
            throw new Error('Invalid order comparator [' + comparator + ']');
        };
        var createComparator = function (strComparator) {
            var funcs = [];
            strComparator.split(',').forEach(function (part) {
                var _a;
                var attr, order;
                _a = part.trim().split(/\s+(?=(?:asc|desc))/i), attr = _a[0], order = _a[1];
                order = (order || 'asc');
                if (order.toLocaleLowerCase() === 'asc') {
                    funcs.push(function (a, b) {
                        if (a[attr] < b[attr])
                            return -1;
                        if (a[attr] > b[attr])
                            return 1;
                        return 0;
                    });
                }
                else if (order.toLocaleLowerCase() === 'desc') {
                    funcs.push(function (a, b) {
                        if (a[attr] > b[attr])
                            return -1;
                        if (a[attr] < b[attr])
                            return 1;
                        return 0;
                    });
                }
                else {
                    throw new Error('Invalid order comparator [' + strComparator + ']');
                }
            });
            return createCombinedComparator(funcs);
        };
        var createCombinedComparator = function (comparators) {
            return function (a, b) {
                for (var i = 0; i < comparators.length; i++) {
                    var r = comparators[i](a, b);
                    if (r !== 0)
                        return r;
                }
                return 0;
            };
        };
        return Relation_;
    };
    /**
     * FILE: src/models/Table.js
     */
    var createTable_ = function () {
        var Table = function (attributes, options) {
            options = (options || {});
            this.row_ = options.row_;
            attributes = (attributes || {});
            var that = this;
            this.__class.columns().forEach(function (c) {
                that[c] = attributes[c];
            });
        };
        Object.assign(Table, {
            sheet: function () {
                if (!this.sheet_memo_) {
                    /*<sheetbase>*/
                    // this.sheet_memo_ = ss_.getSheetByName(this.sheetName);
                    this.sheet_memo_ = (this.spreadsheet || ss_).getSheetByName(this.sheetName);
                    /*</sheetbase>*/
                }
                return this.sheet_memo_;
            },
            first: function () {
                var values = this.allValues();
                if (values.length === 0)
                    return null;
                return new this(this.objectFrom(values[0]), { row_: 2 });
            },
            last: function () {
                var values = this.allValues();
                if (values.length === 0)
                    return null;
                return new this(this.objectFrom(values[values.length - 1]), { row_: values.length + 1 });
            },
            find: function (id) {
                var values = this.allValues();
                for (var i = 0; i < values.length; i++) {
                    if (values[i][this.idColumnIndex()] === id) {
                        return new this(this.objectFrom(values[i]), { row_: i + 2 });
                    }
                }
                throw new Error('Record not found [id=' + id + ']');
            },
            all: function () {
                var records = [];
                var that = this;
                this.allValues().forEach(function (values, i) {
                    records.push(new that(that.objectFrom(values), { row_: i + 2 }));
                });
                return records;
            },
            pluck: function (column) {
                var result = [];
                var that = this;
                this.allValues().forEach(function (values) {
                    result.push(values[that.columnIndexOf(column)]);
                });
                return result;
            },
            sum: function (column) {
                var total = 0;
                var that = this;
                this.allValues().forEach(function (values) {
                    total += Number(values[that.columnIndexOf(column)]);
                });
                return total;
            },
            max: function (column) {
                return Math.max.apply(null, this.pluck(column));
            },
            min: function (column) {
                return Math.min.apply(null, this.pluck(column));
            },
            where: function (predicate) {
                var r = new Relation_(this);
                return r.where(predicate);
            },
            order: function (comparator) {
                var r = new Relation_(this);
                return r.order(comparator);
            },
            columns: function () {
                if (!this.columns_memo_) {
                    this.columns_memo_ = this.dataRange().offset(0, 0, 1).getValues()[0];
                }
                return this.columns_memo_;
            },
            columnIndexOf: function (column) {
                var index = this.columns().indexOf(column);
                if (index === -1)
                    throw new Error('Invalid column given!');
                return index;
            },
            columnABCFor: function (column) {
                return indexToABC(this.columnIndexOf(column) + 1);
            },
            dataRange: function () {
                return this.sheet().getDataRange();
            },
            rangeByRow: function (row_) {
                return this.dataRange().offset(row_ - 1, 0, 1);
            },
            objectFrom: function (values) {
                var obj = {};
                this.columns().forEach(function (c, i) {
                    obj[c] = values[i];
                });
                return obj;
            },
            valuesFrom: function (record) {
                var values = [];
                this.columns().forEach(function (c, i) {
                    values.push(typeof record[c] === 'undefined' ? null : record[c]);
                });
                return values;
            },
            allValues: function () {
                var allValues = this.dataRange().getValues();
                allValues.shift();
                return allValues;
            },
            create: function (recordOrAttributes) {
                var record = recordOrAttributes.__class === this ? recordOrAttributes : new this(recordOrAttributes);
                delete record.row_;
                if (!record.isValid())
                    return false;
                var that = this;
                var appendRow = function (values) {
                    var row = that.sheet().getLastRow() + 1;
                    that.sheet().getRange(row, 1, 1, that.columns().length).setValues([values]);
                    record.row_ = row;
                };
                var values = this.valuesFrom(record);
                if (isPresent(record[this.idColumn])) {
                    appendRow(values);
                }
                else {
                    this.withNextId(function (nextId) {
                        values[that.idColumnIndex()] = nextId;
                        appendRow(values);
                        record[that.idColumn] = nextId;
                    });
                }
                return record;
            },
            update: function (recordOrAttributes) {
                var record = this.find(recordOrAttributes[this.idColumn]);
                record.setAttributes(recordOrAttributes);
                if (recordOrAttributes.__class === this) {
                    recordOrAttributes.row_ = record.row_;
                }
                if (record.isValid()) {
                    var values = this.valuesFrom(record);
                    this.rangeByRow(record.row_).setValues([values]);
                    return true;
                }
                return false;
            },
            createOrUpdate: function (recordOrAttributes) {
                var id = recordOrAttributes[this.idColumn];
                if (isPresent(id)) {
                    var condition = {};
                    condition[this.idColumn] = id;
                    if (this.where(condition).first()) {
                        return this.update(recordOrAttributes);
                    }
                    else {
                        return this.create(recordOrAttributes);
                    }
                }
                else {
                    return this.create(recordOrAttributes);
                }
            },
            destroy: function (record) {
                this.sheet().deleteRow(record.row_);
            },
            withNextId: function (callback) {
                var ids = this.idValues();
                var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
                callback(nextId);
            },
            idValues: function () {
                var idValues = [];
                var that = this;
                this.allValues().forEach(function (values) {
                    idValues.push(values[that.idColumnIndex()]);
                });
                return idValues;
            },
            idColumnIndex: function () {
                if (!this.idColumnIndex_memo_) {
                    var i = this.columns().indexOf(this.idColumn);
                    if (i === -1)
                        throw new Error('Not found id column "' + this.idColumn + '" on ' + this.sheet().getName());
                    this.idColumnIndex_memo_ = i;
                }
                return this.idColumnIndex_memo_;
            }
        });
        Object.defineProperties(Table.prototype, {
            save: { value: function () {
                    this.errors = {};
                    var updateOrCreate = this.isNewRecord() ? 'create' : 'update';
                    return this.__class[updateOrCreate](this);
                } },
            updateAttributes: { value: function (attributes) {
                    var that = this;
                    this.__class.columns().forEach(function (c, i) {
                        if (c in attributes) {
                            that[c] = attributes[c];
                        }
                    });
                    return this.save();
                } },
            destroy: { value: function () {
                    this.__class.destroy(this);
                } },
            validate: { value: function (on) {
                    // override it if you need
                } },
            isValid: { value: function () {
                    this.errors = {};
                    if (!this.__class.autoIncrement && isBlank(this[this.__class.idColumn])) {
                        this.errors[this.__class.idColumn] = 'can\'t be blank';
                    }
                    this.validate(this.isNewRecord() ? 'create' : 'update');
                    return noKeys(this.errors);
                } },
            isNewRecord: { value: function () {
                    return !this.row_;
                } },
            getAttributes: { value: function () {
                    var obj = {};
                    var that = this;
                    this.__class.columns().forEach(function (c, i) {
                        obj[c] = typeof that[c] === 'undefined' ? null : that[c];
                    });
                    return obj;
                } },
            setAttributes: { value: function (attributes) {
                    var that = this;
                    this.__class.columns().forEach(function (c, i) {
                        that[c] = typeof attributes[c] === 'undefined' ? null : attributes[c];
                    });
                } }
        });
        Table.define = function (classProps, instanceProps) {
            var Parent = this;
            var Child = function () { return Parent.apply(this, arguments); };
            Object.assign(Child, Parent);
            Child.prototype = Object.create(Parent.prototype);
            Object.defineProperties(Child.prototype, {
                __class: { value: Child },
                constructor: { value: Child }
            });
            for (var name in instanceProps) {
                Object.defineProperty(Child.prototype, name, { value: instanceProps[name] });
            }
            Object.assign(Child, Object.assign({
                idColumn: '#',
                autoIncrement: true
            }, classProps));
            return Child;
        };
        var indexToABC = function (index) {
            var n = index - 1;
            var ordA = 'A'.charCodeAt(0);
            var ordZ = 'Z'.charCodeAt(0);
            var len = ordZ - ordA + 1;
            var s = '';
            while (n >= 0) {
                s = String.fromCharCode(n % len + ordA) + s;
                n = Math.floor(n / len) - 1;
            }
            return s;
        };
        var noKeys = function (object) {
            return Object.keys(object || {}).length === 0;
        };
        var isBlank = function (value) {
            return typeof value === 'undefined' || value === null || String(value).trim() === '';
        };
        var isPresent = function (value) {
            return typeof value !== 'undefined' && value !== null && String(value) !== '';
        };
        return Table;
    };
    /**
     * FILE: src/init.js
     */
    var ss_;
    var Table;
    var Relation_;
    var callbacks_ = [];
    /**
     * Initializes Tamotsu with the given objects
     *
     * @param {Spreadsheet} spreadsheet Spreadsheet object you will handle.<br>
     *                                  When not given, SpreadsheetApp.getActive() is used.
     */
    function initialize(spreadsheet) {
        ss_ = spreadsheet || SpreadsheetApp.getActive();
        Table = createTable_();
        Relation_ = createRelation_();
        callbacks_.forEach(function (callback) {
            callback(spreadsheet);
        });
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */
    var Symbol = root.Symbol;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Built-in value references. */
    var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString$1.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag$1 && symToStringTag$1 in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype,
        objectProto$2 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */
    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /* Built-in method references that are verified to be native. */
    var Map = getNative(root, 'Map');

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$4.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

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
            function (req, res, next) { return next(); },
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

    var __assign$3 = (undefined && undefined.__assign) || function () {
        __assign$3 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };
    var Utils = new UtilsService();
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
        SheetsNosqlService.prototype.registerRoutes = function (options) {
            sheetsNosqlModuleRoutes(this, this.options.router, options);
        };
        SheetsNosqlService.prototype.object = function (path) {
            return this.get(path);
        };
        SheetsNosqlService.prototype.list = function (path) {
            var data = this.get(path);
            return Utils.o2a(data);
        };
        SheetsNosqlService.prototype.doc = function (collectionId, docId) {
            return this.object("/" + collectionId + "/" + docId);
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
            initialize(SpreadsheetApp.openById(databaseId));
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
                    models[collectionId] = Table.define({ sheetName: collectionId });
                }
                if (!masterData[collectionId]) {
                    masterData[collectionId] = this_1.get("/" + collectionId) || {};
                }
                // update data in memory
                set(masterData[collectionId], pathSplits, updates[path]);
                // load item from sheet
                var item = models[collectionId].where(function (itemInDB) {
                    return (itemInDB['key'] === docId) ||
                        (itemInDB['slug'] === docId) ||
                        ((itemInDB['id'] + '') === docId) ||
                        ((itemInDB['#'] + '') === docId);
                }).first();
                // update the model
                var dataInMemory = __assign$3({ key: docId, slug: docId, id: docId }, masterData[collectionId][docId]);
                for (var _i = 0, _a = Object.keys(dataInMemory); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (dataInMemory[key] instanceof Object) {
                        dataInMemory[key] = JSON.stringify(dataInMemory[key]);
                    }
                }
                if (item) {
                    item = __assign$3({}, item, dataInMemory);
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
            return get(masterData, pathSplits);
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
                    items.push(Utils.honorData(item));
                }
            }
            return Utils.a2o(items);
        };
        return SheetsNosqlService;
    }());

    function sheetsNosql(options) {
        return new SheetsNosqlService(options);
    }

    exports.sheetsNosql = sheetsNosql;
    exports.SheetsNosqlService = SheetsNosqlService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sheetbase-sheets-nosql-server.umd.js.map
