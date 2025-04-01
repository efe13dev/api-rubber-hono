import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stockTable = sqliteTable('stock', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	quantity: int().notNull().default(0),
});

export const formulaTable = sqliteTable('formula', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

export const formulaIngredientTable = sqliteTable('formula_ingredient', {
	id: int().primaryKey({ autoIncrement: true }),
	formulaId: int().notNull(),
	name: text().notNull(),
	quantity: int().notNull(),
});
