'use strict';

const ws = require('ws');
const proxy = require('https-proxy-agent');

class wsClient {
    constructor(url, initHandler, msgProcessor) {
        this.url = url;
        this.client = new ws.WebSocket(url, { agent: new proxy('http://127.0.0.1:8888'), rejectUnauthorized: false, });

        this.client.on('open', () => {
            console.log('open');
            initHandler(this);
        });
        this.client.on('message', (data) => {
            msgProcessor(data);
        });

        this.client.on('error', (err) => {
            console.log('error:', err);
        });
        this.client.on('close', (code, reason) => {
            console.log(`${code}, ${reason}`);
        });
    }

    send(data) {
        this.client.send(data);
    }
};

module.exports = wsClient;
