"use client"

import { IconCirclePlusFilled, IconDashboard, IconHome, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addBalanceSchema } from "@/schemas/addBalance.schema"
import { z } from "zod"
import { Input } from "./ui/input"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/utils/apiResponse"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTimeout } from "usehooks-ts"

type Item = {
  title: string,
  url: string,
  icon?: Icon,
}

export function NavMain() {
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const items: Item[] = [
    {
      title: 'Home',
      url: '/',
      icon: IconHome,
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    }
  ];

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof addBalanceSchema>>({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: {
      upi: undefined,
      cash: undefined,
    },
  });

  const { data: session, update } = useSession();

  const handleAddBalance = async (data: z.infer<typeof addBalanceSchema>) => {
    setLoading(true);

    try {
      const res = await axios.patch<ApiResponse>('/api/user/update-balance', data);

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error while updating balance E:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error('Failed to update balance', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
      form.reset();
      closeDialogRef.current?.click();
    }

    useTimeout(() => {
      router.refresh();
    }, 1000);
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip=""
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
                >
                  <IconCirclePlusFilled />
                  <span>Add Balance</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Balance</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Add a new balance to your account.
                </DialogDescription>

                <DialogClose ref={closeDialogRef} />

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddBalance)} className="grid gap-4 py-4 space-y-2">
                    <FormField
                      name="upi"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>UPI</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter UPI Amount"
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none col-span-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="ml-4 col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="cash"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Cash</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter Cash Amount"
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none col-span-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="ml-4 col-span-4" />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={loading} className="w-full mt-6">
                        {
                          loading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Please Wait
                            </>
                          ) : (
                            'Add Balance'
                          )
                        }
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {
            items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <Link href={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
