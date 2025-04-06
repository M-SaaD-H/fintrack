import { ApiResponse } from '@/utils/apiResponse';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type infoType = {
  currentInfo: {
    cash: {
      amount: number;
      updatedAt: Date;
    };
    upi: {
      amount: number;
      updatedAt: Date;
    };
  };
  spentInfo: {
    upi: {
      totalAmountSpent: number;
      lastSpentDate: Date;
    };
    cash: {
      totalAmountSpent: number;
      lastSpentDate: Date;
    };
  }
}

type UserExpenseInfoStore = {
  info: infoType | null;
  isFetchingUserInfo: boolean;
  fetchUserInfo: () => Promise<void>;
};

const userInfoExpenseStore: StateCreator<UserExpenseInfoStore> = (set) => ({
  info: null,
  isFetchingUserInfo: false,
  
  fetchUserInfo: async () => {
    try {
      set({ isFetchingUserInfo: true });
      const response = await axios.get<ApiResponse>('/api/expense/get-info');
      set({ info: response.data.data as infoType });
    } catch (error) {
      console.log('Error fetching user info:', error);
      const apiError = error as AxiosError<ApiResponse>;
      toast.error('Error fetching user info', {
        description: apiError.response?.data.message || 'Something went wrong'
      });
    } finally {
      set({ isFetchingUserInfo: false });
    }
  }
});

export const useUserExpenseInfoStore = create<UserExpenseInfoStore>()(
  devtools(
		persist(userInfoExpenseStore, { name: 'user-expense-info-store' })
	)
);
