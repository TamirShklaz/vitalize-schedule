"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  createDeleteShift,
  getNurses,
  Nurse,
} from "@/lib/actions/shifts.actions"
import { useServerActionQuery } from "@/lib/hooks/use-server-action-query"
import { useServerActionMutation } from "@/lib/hooks/use-server-action-mutation"
import { isSameDay } from "date-fns"
import { toast } from "sonner"

// Helper function to generate dates
const generateDates = (startDate: Date, numDays: number) => {
  const dates = []
  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

// Sample data
const startDate = new Date()
const dates = generateDates(startDate, 7)

export default function ShiftAvailabilityMatrix() {
  const {
    data: nurses,
    isLoading,
    error,
  } = useServerActionQuery(getNurses, undefined)

  const {
    data: lastModifiedShift,
    isLoading: isShiftLoading,
    error: shiftError,
    trigger,
  } = useServerActionMutation(createDeleteShift)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!nurses || nurses.length === 0) {
    return <div>No nurses found</div>
  }

  const onClick = async (nurse: Nurse, date: Date) => {
    const existingShift = nurse.shifts.find(shift =>
      isSameDay(shift.date, date),
    )
    const updatedShiftRes = await trigger({
      nurseId: nurse.id,
      date,
      id: existingShift?.id || undefined,
    })
    if (!updatedShiftRes || !updatedShiftRes.data || updatedShiftRes.error) {
      console.error(updatedShiftRes.error)
      return
    }
    const nurseToUpdate = nurses.find(n => n.id === nurse.id)!

    if (existingShift) {
      nurseToUpdate.shifts = nurseToUpdate.shifts.filter(
        shift => shift.id !== existingShift.id,
      )
      toast.success("Shift removed")
    } else {
      // Added
      nurseToUpdate.shifts.push(updatedShiftRes.data)
      toast.success("Shift added")
    }
  }

  console.log(nurses)

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-4'>Shift Availability Matrix</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[150px]'>Nurse</TableHead>
              {dates.map(date => (
                <TableHead key={date.toISOString()} className='text-center'>
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {nurses.map((nurse, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{nurse.name}</TableCell>
                {dates.map(date => (
                  <TableCell key={date.toISOString()} className='text-center'>
                    <Checkbox
                      checked={
                        !!nurse.shifts.find(shift =>
                          isSameDay(shift.date, date),
                        )
                      }
                      id={`${nurse}-${date.toISOString()}`}
                      aria-label={`${nurse} availability for ${date.toLocaleDateString()}`}
                      onClick={() => onClick(nurse, date)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
