/*jslint node: true */
"use strict";


var u           = require("underscore"),
    statuses    = require("./statuses.json"),
    camel;

camel = (function () {
    var needle = /(?: |-)+/g;

    return function (haystack) {
        return haystack.replace(needle, "");
    };
}());

u.each(statuses, function (code, name) {

    if (code >= 400 && code < 600) {
        exports["create" + camel(name)] = function (message) {
            var rval = new Error(message || name);
            rval.httpStatus = code;
            return rval;
        };
    }
});

exports.handler = function (err, req, res, next) {
    /*jslint unparam: true */
    var status = err.httpStatus || 500,
        body = err.detail || {description: err.message};
    res.send(status, body);
};

