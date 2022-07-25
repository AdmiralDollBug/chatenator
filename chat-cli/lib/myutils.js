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

// 注：由于js标准限制，num的范围应为-2^31 ~ 2^31，否则结果将与预期不符
// 但在本项目的场景里已经够用了
function packToIntBuffer(num) {
    let b = [];
    while (num > 0) {
        const byte = num - (num >> 8 << 8);
        num = num >> 8;
        b = [byte].concat(b);
    }

    while (b.length < 4) {
        b.push(0);
    }

    return Buffer.from(new Uint8Array(b));
}

module.exports = {
    makeSuccess,
    makeError,
    packToIntBuffer,
};
