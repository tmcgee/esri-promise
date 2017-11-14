require('es6-promise');

// Setup a simple DOM
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
