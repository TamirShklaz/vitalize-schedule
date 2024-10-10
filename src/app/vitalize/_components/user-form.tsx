"use client"

import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { NewUser, newUserSchema } from "@/lib/schemas/new-user.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addUser } from "@/lib/actions/user.actions"

type Props = { className?: string }

function UserForm({ className }: Props) {
  const form = useForm<NewUser>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: NewUser) => {
    console.log("submitting", data)
    const res = await addUser(data)
    console.log(res)
  }
  return (
    <div className={cn(className)}>
      <h1 className={"mb-10 text-3xl"}>Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
          <FormField
            name={"name"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"email"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type={"submit"}>Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default UserForm
