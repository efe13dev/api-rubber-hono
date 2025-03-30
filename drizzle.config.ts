import { defineConfig } from 'drizzle-kit';

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
	throw new Error(
		'Missing required environment variables for database connection',
	);
}

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
