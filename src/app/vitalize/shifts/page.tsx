"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getNurses, getSchedule, Nurse } from "@/lib/actions/shifts.actions"

type Props = { className?: string }

function Page({ className }: Props) {
  // const [shifts, setShifts] = useState([])

  const [nurses, setNurses] = useState<Nurse[]>([])
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const shifts = await getSchedule()
    console.log(shifts)

    const data = await getNurses()
    setNurses(data)
  }

  // {nurse, date, id}

  // export const onGridClick = async () => {
  //   // determine grid state
  //   const booked = true
  //   if (booked) {
  //     await deleteAssignment()
  //   } else {
  //     await addShift()
  //   }
  // }

  return (
    <div className={cn(className, "flex flex-col")}>
      <h1 className={"text-3xl"}>Nurse Shifts</h1>
      <div className={"flex flex-col"}>
        {nurses.map((nurse, key) => (
          <div key={key}>{nurse.name}</div>
        ))}
      </div>
      <div></div>
    </div>
  )
}

export default Page
