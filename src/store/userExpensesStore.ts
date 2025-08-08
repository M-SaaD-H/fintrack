import { Expense } from "@/components/columns";
import { ApiResponse } from "@/utils/apiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserExpensesStore = {
  expenses: Expense[] | [];
  isFetchingExpenses: boolean;
  currentSem: number;
  fetchUserExpenses: (sem: number) => Promise<void>;
  setCurrentSem: (sem: number) => void;
}

const userExpensesStore: StateCreator<UserExpensesStore> = (set) => ({
  expenses: [],
  isFetchingExpenses: false,
  currentSem: 1,

  fetchUserExpenses: async (sem: number) => {
    set({ isFetchingExpenses: true });
    try {
      const response = await axios.get<ApiResponse>(`/api/user/get-all-expenses/sem/${sem}`);
      set({ expenses: response.data.data?.expenses as Expense[], currentSem: sem })
    } catch (error) {
      console.log('Error fetching expenses E:', error);
      const apiError = error as AxiosError<ApiResponse>;
      toast.error('Error fetching user expenses', {
        description: apiError.response?.data.message || 'Something went wrong'
      });
    } finally {
      set({ isFetchingExpenses: false });
    }
  },

  setCurrentSem: (sem: number) => {
    set({ currentSem: sem });
  }
});

export const useUserExpensesStore = create<UserExpensesStore>()(
  devtools(
    persist(userExpensesStore, { name: 'user-expenses-store' })
  )
);