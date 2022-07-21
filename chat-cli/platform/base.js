'use strict';

class ChatClient {
    constructor(roomId) {
        this.roomId = roomId;
    }

    async initMetaData() {
        throw new Error('Should not call method of base class');
    }

    async startReceive() {
        throw new Error('Should not call method of base class');
    }
};

module.exports = ChatClient;
