'use strict';

const ChatClient = require('./base');
const { makeSuccess, makeError } = require('../lib/myutils');
const axios = require('axios').default;

class DouyuChatClient extends ChatClient {
    constructor(roomId) {
        super(roomId);

        this.chatWssUrl = 'wss://danmuproxy.douyu.com:8503/';
        this.heartbeatMsg = Buffer.from('1400000014000000b102000074797065403d6d726b6c2f00', 'hex');
        this.heartbeatInterval = 60;
    }

    async initMetaData() {
        // 1. 获取真实房间ID
        try {
            const resp = await axios.get(`https://m.douyu.com/${this.roomId}`);
            this.realRoomId = resp.data.match(/"rid":(\d{1,8})/)[1]
        } catch (e) {
            return makeError(-1, 'failed to fetch real room ID, the error is: %j', e);
        }
    }

    async startReceive() {

    }
};

module.exports = DouyuChatClient;
