'use strict';

const cliSet = require('./platform/export');
const assert = require('./lib/myassert');
const { makeSuccess, makeError } = require('./lib/myutils');

const cliMap = {
    'douyu': cliSet.DouyuChatClient,
}

module.exports = async (type, roomId) => {
    assert(typeof type === 'string', 'type must be a string');
    assert(roomId, 'roomId must not be empty');
    const ClientType = assert(cliMap[type.toLowerCase()], `type: ${type} is not supported`);

    const client = new ClientType(roomId);

    let result;
    result = await client.initMetaData();
    if (result.code !== 0) {
        return makeError(result.code, `[${type}]init metaData failed, msg: ${result.msg}`);
    }

    result = await client.startReceive();
    if (result.code !== 0) {
        return makeError(result.code, `[${type}]start receive failed, msg: ${result.msg}`);
    }

    return makeSuccess();
};
