'use strict';

module.exports = (expr, msg) => {
    if (!expr) {
        throw new Error("assertion failed! " + msg);
    }
    return expr;
};