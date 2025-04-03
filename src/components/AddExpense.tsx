import { useState } from "react";

import { Button } from "./ui/button"
import { Loader2, PlusIcon } from "lucide-react"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog"
import { useRef } from "react";
import { useRefresh } from "@/context/RefreshContext";
import { Form, FormField, FormLabel, FormControl, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addExpenseSchema } from "@/schemas/addExpenseSchema";
import { Input } from "./ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import axios from "axios";
import { ApiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const AddExpense = () => {
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const { refresh } = useRefresh();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof addExpenseSchema>>({
    resolver: zodResolver(addExpenseSchema)
  });

  const onSubmit = async (data: z.infer<typeof addExpenseSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/expense/add', data);
      
      if(response.data.success) {
        toast.success(response.data.message);
        refresh();
      }
    } catch (error) {
      console.log('Error adding expense E:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error('Error adding expense', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      form.reset();
      closeDialogRef.current?.click();
    }
  }

  return (
    <div className="text-right mx-4 lg:mx-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="w-4 h-4" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add a new expense to your account.
            </DialogDescription>
          </DialogHeader>

          <DialogClose ref={closeDialogRef} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Description" className="w-full" />
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
                      <Input type='number' placeholder="Enter Amount" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full" {...field} />
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

              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full mt-4">
                  {
                    loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Please Wait
                      </>
                    ) : (
                      'Add Expense'
                    )
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
