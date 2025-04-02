const { Hono } = require('hono');
const { handle } = require('../adapters/netlify');
const app = require('../../dist/index.js');

exports.handler = handle(app);
