import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const testing = sqliteTable('testing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  created_at: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
