import { drizzle } from 'drizzle-orm/libsql';

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
	throw new Error(
		'Missing required environment variables for database connection',
	);
}

export const db = drizzle({
	connection: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
