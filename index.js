/*jslint node: true */
"use strict";

var liburl  = require('url'),
    u       = require("underscore");

function up(path) {
    var brk;
    if (!path || path === "/") {
        throw new Error("cannot move up from root");
    }
    if (path.slice(-1) === "/") {
        path = path.slice(0, -1);
    }
    if (path.slice(0, 1) === "/") {
        path = path.slice(1);
    }
    brk = path.lastIndexOf("/");
    if (brk >= 0) {
        path = path.slice(0, brk);
    } else {
        path = "";
    }
    return "/" + path;
}

function down(path, elem) {
    if (path.slice(0, 1) === "/") {
        path = path.slice(1);
    }
    if (path.slice(-1) === "/") {
        path = path.slice(0, -1);
    }
    if (elem.slice(0, 1) !== "/") {
        elem = "/" + elem;
    }
    return path + elem;
}

function build(req, newPath, query) {
    var spec = {
        protocol:   req.protocol,
        host:       req.headers.host,
        pathname:   newPath
    };
    if (query) {
        spec.query = query;
    }
    return liburl.format(spec);
}

exports.url = build;

exports.baseUrl = function (req) {
    return build(req, "/");
};

exports.upUrl = function (req, query) {
    return build(req, up(req.path), query);
};

exports.downUrl = function (req, seg, query) {
    return build(req, down(req.path, seg), query);
};

exports.selfUrl = function (req, query) {
    return build(req, req.path, query);
};

exports.foreignUrl = function (req, fpath, seg) {
    var path = seg
        ? down(fpath, seg)
        : fpath;

    return build(req, path);
};

exports.hlink = function (url_s, attrs) {
    var rval;

    function build(url) {
        var l = {href: url};
        if (attrs) {
            u.extend(l, attrs);
        }
        return l;
    }

    if (u.isArray(url_s)) {
        rval = u.map(url_s, build);
    } else {
        rval = build(url_s);
    }
    return rval;
};

