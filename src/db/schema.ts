import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const nurses = pgTable("nurses", {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  name: text().notNull(),
})

// 1. Delete the shift from the DB
// 2. Creating a state on a shift

// 1. Each shift has an id
// 2. Make the date and nurse id a composite key
export const shifts = pgTable("shifts", {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow().notNull(),
  nurseId: uuid()
    .notNull()
    .references(() => nurses.id, { onDelete: "cascade" }),
  date: timestamp().notNull(),
})

export const nurseRelations = relations(nurses, ({ many, one }) => ({
  shifts: many(shifts),
}))

export const shiftRelations = relations(shifts, ({ one }) => ({
  nurse: one(nurses, {
    fields: [shifts.nurseId],
    references: [nurses.id],
  }),
}))
