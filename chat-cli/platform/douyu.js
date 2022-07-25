'use strict';

const ChatClient = require('./base');
const { makeSuccess, makeError, packToIntBuffer } = require('../lib/myutils');
const wsClient = require('../lib/wsclient');
const axios = require('axios').default;

function _initFunc(realRoomId) {
    /**
     * 
     * @param {wsClient} client 
    */
    return function (client) {
        let data;
        const regData = [];
        data = `type@=loginreq/roomid@=${realRoomId}/`;
        regData.push(_packSendData(data));
        data = `type@=joingroup/rid@=${realRoomId}/gid@=-9999/`;
        regData.push(_packSendData(data));

        for (const payload of regData) {
            client.send(payload);
        }
    }
}

/**
 * 
 * @param {import('ws').Data} data 
 */
function _msgProcessor(data) {
    const msgs = [];
    for (let msg of data.toString('utf-8').matchAll(/(type@=.*?)\x00/)) {
        let matched = msg[0];
        try {
            matched = matched.replace(/@=/g, '":"').replace(/\//g, '","');
            matched = matched.replace(/@A/g, '@').replace(/@S/g, '/');
            matched = JSON.parse('{"' + matched.substring(0, matched.length - 3) + '}');

            // console.log(matched);
            switch (matched['type']) {
                case 'chatmsg':
                    console.log(`${matched['nn']}: ${matched['txt']}`);
                    break;
                case 'uenter':
                    console.log(`用户${matched['nn']}进入直播间`);
                    break;
                case 'dgb':
                    // TODO
                    break;
            }
        } catch (error) {
            // 某些消息不能按照上述方式转换格式，故暂时先忽略错误
            continue;
        }
    }
}

function _packSendData(data) {
    let header = packToIntBuffer(data.length + 9);
    header = Buffer.concat([header, header, Buffer.from('b1020000', 'hex')]);
    return Buffer.concat([header, Buffer.from(data, 'utf8'), Buffer.from('00', 'hex')]);
}

class DouyuChatClient extends ChatClient {
    constructor(roomId) {
        super(roomId);

        this.chatWssUrl = 'wss://danmuproxy.douyu.com:8504/';
        this.heartbeatMsg = Buffer.from('1400000014000000b102000074797065403d6d726b6c2f00', 'hex');
        this.heartbeatInterval = 60;
    }

    async start() {
        // 1. 获取真实房间ID
        try {
            const resp = await axios.get(`https://m.douyu.com/${this.roomId}`);
            this.realRoomId = resp.data.match(/"rid":(\d{1,8})/)[1]
            if (!this.realRoomId) {
                throw new Error('parse real room id failed');
            }
        } catch (e) {
            return makeError(-1, 'failed to fetch real room ID, the error is: %j', e);
        }

        // 2. 初始化websocket client
        this.client = new wsClient(this.chatWssUrl, _initFunc(this.realRoomId), _msgProcessor);

        // 3. 定时发送心跳
        setInterval(() => {
            this.client.send(this.heartbeatMsg);
        }, this.heartbeatInterval * 1000);

        return makeSuccess();
    }

    async wait() {
        return makeSuccess();
    }
};

module.exports = DouyuChatClient;
