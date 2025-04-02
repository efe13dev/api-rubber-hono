import { Hono } from 'hono';
import { handle } from '../adapters/netlify.js';
import app from '../../dist/index.js';

export const handler = handle(app);
