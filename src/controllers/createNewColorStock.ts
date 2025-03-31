import type { Context } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';
import { sql } from 'drizzle-orm';

async function createNewColorStock(c: Context) {}
