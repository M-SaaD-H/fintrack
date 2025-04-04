'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "./ui/button";
import { Loader2, MoreVerticalIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { IconBrandGoogle, IconCashBanknote } from "@tabler/icons-react";
import { Drawer, DrawerTitle, DrawerContent, DrawerHeader, DrawerFooter, DrawerDescription, DrawerClose } from "./ui/drawer";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { editExpenseSchema } from "@/schemas/editExpense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/utils/apiResponse";
import { useRefresh } from "@/context/RefreshContext";

function formatDate(date: Date | string) {
  if (typeof window === 'undefined') return '';

  date = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const formattedDate = date.toLocaleString('en-US', options).replace(',', ' at');

  return formattedDate;
}

export type Expense = {
  _id: string
  description: string
  paymentMethod: "UPI" | "Cash"
  amount: number
  category: "Food" | "Transportation" | "Entertainment" | "Shopping" | "Other"
  createdAt: Date
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "sno",
    header: "S.No",
    cell: ({ row }) => {
      return <div className="mx-2 font-medium">{row.index + 1}</div>
    }
  },
  {
    accessorKey: "description",
    header: () => <div className="md:ml-4 md:w-[20rem]">Description</div>,
    cell: ({ row }) => {
      return <div className="md:ml-4 md:w-[20rem]">{row.original.description}</div>
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.category}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {
            row.original.paymentMethod === 'Cash'
              ? <IconCashBanknote className="h-4 w-4" />
              : <IconBrandGoogle className="h-4 w-4" />
          }
          {row.original.paymentMethod}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => {
      return <div className="text-right">{formatDate(row.original.createdAt)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />
  }
]

const Actions = ({ row }: { row: Row<Expense> }) => {
  const isMoble = useIsMobile();
  const [open, setOpen] = useState(false);
  const { refresh } = useRefresh();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof editExpenseSchema>>({
    resolver: zodResolver(editExpenseSchema),
    defaultValues: {
      description: row.original.description,
      category: row.original.category as "Food" | "Stationary" | "Transportation" | "Entertainment" | "Other",
      paymentMethod: row.original.paymentMethod as "Cash" | "UPI",
      amount: row.original.amount,
    }
  });

  const onSubmit = async (data: z.infer<typeof editExpenseSchema>) => {
    setLoading(true);

    try {
      const response = await axios.patch<ApiResponse>(`/api/expense/edit?expenseId=${row.original._id}`, data);

      if (response.data.success) {
        toast.success('Expense updated successfully');
        refresh();
      }
    } catch (error) {
      console.error('Error while updating expense E:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error('Failed to update expense', {
        description: errorMessage
      });
    } finally {
      setOpen(false);
      form.reset();
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/expense/delete?expenseId=${row.original._id}`);

      if (response.data.success) {
        toast.success('Expense deleted successfully');
        refresh();
      }
    } catch (error) {
      console.error('Error while deleting expense:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error('Failed to delete expense', {
        description: errorMessage
      });
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDelete} variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Here using the drawer component from dropdown menu and without using drawer trigger is not a very good approach. But it is the only way that I can think of to resolve the issue of closing of the dropdown and the drawer */}

      <Drawer open={open} onOpenChange={setOpen} direction={isMoble ? "bottom" : "right"}>
        <DrawerContent className="pt-3">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">Edit your expense</DrawerTitle>
            <DrawerDescription>
              Make changes to your expense here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="edit-expense-form" className="mx-4 my-8 space-y-4">
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type='number' className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Stationary">Stationary</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="paymentMethod"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DrawerFooter>
            <Button type="submit" form="edit-expense-form" disabled={loading} className="w-full mt-4">
              {
                loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please Wait
                  </>
                ) : (
                  'Save'
                )
              }
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}