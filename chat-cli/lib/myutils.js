'use strict';

const util = require('util');

function makeResult(code, data, msg, ...param) {
    return { code, data, msg: util.format(msg, param), };
}

function makeSuccess(data, msg, ...param) {
    if (!msg) {
        msg = 'success';
    }
    return makeResult(0, data, msg, param);
}

function makeError(code, msg, ...param) {
    return makeResult(code, undefined, msg, param);
}

module.exports = {
    makeSuccess,
    makeError,
};
