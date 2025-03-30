import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stockTable = sqliteTable('stock', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	quantity: int().notNull(),
});
