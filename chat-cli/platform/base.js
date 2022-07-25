'use strict';

class ChatClient {
    constructor(roomId) {
        this.roomId = roomId;
    }

    async start() {
        throw new Error('Should not call method of base class');
    }

    async wait() {
        throw new Error('Should not call method of base class');
    }
};

module.exports = ChatClient;
