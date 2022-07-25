'use strict';

const generator = require('./chat-cli/generator');
const ws = require('ws');

async function main() {
    await generator('douyu', '235520');
}

main();