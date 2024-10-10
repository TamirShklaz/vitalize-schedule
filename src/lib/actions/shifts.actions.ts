"use server"

import { db } from "@/db/drizzle"
import { nurses, shifts } from "@/db/schema"
import { asc, eq } from "drizzle-orm"
import { ServerActionFunction } from "@/lib/types/action.types"

export type AddShiftArgs = {
  nurseId: string
  date: Date
}

export const addShift = async (args: AddShiftArgs) => {
  //TODO: add validation on the args

  const newShift = await db.insert(shifts).values(args).returning()

  return [newShift]
}

export const deleteShift = async (id: string) => {
  const deleted = await db.delete(shifts).where(eq(shifts.id, id))
  return deleted
}

export type CreateDeleteShiftArgs = {
  // If there is an ID delete it, otherwise add a new shift
  id?: string
  nurseId: string
  date: Date
}
export type Shift = typeof shifts.$inferSelect

export const createDeleteShift: ServerActionFunction<
  CreateDeleteShiftArgs,
  Shift
> = async (args: CreateDeleteShiftArgs) => {
  if (args.id) {
    const [deleted] = await db
      .delete(shifts)
      .where(eq(shifts.id, args.id))
      .returning()
    return {
      success: true,
      data: deleted,
    }
  } else {
    const [newShift] = await db.insert(shifts).values(args).returning()
    return {
      success: true,
      data: newShift,
    }
  }
}

export type Nurse = typeof nurses.$inferSelect & {
  shifts: (typeof shifts.$inferSelect)[]
}
export const getNurses: ServerActionFunction<void, Nurse[]> = async () => {
  const nurses = await db.query.nurses.findMany({
    with: {
      shifts: true,
    },
  })
  return {
    success: true,
    data: nurses,
  }
}

export const getSchedule = async () => {
  //TODO: fix why nurses aren't being returned
  const data = db.query.shifts.findMany({
    orderBy: asc(shifts.date),
  })

  return data
}
