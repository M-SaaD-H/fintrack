'use client';

import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { ApiResponse } from "@/utils/apiResponse"
import axios from "axios"
import { toast } from "sonner";
import { useRefresh } from "@/context/RefreshContext";

import { Expense } from "@/components/columns";
import { AddExpense } from "@/components/AddExpense";

export default function Page() {
  const [data, setData] = useState<Expense[]>([]);

  const { refreshTrigger } = useRefresh();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/user/get-all-expenses');
        setData(response.data.data);
      } catch (error) {
        console.log('Error fetching expenses E:', error);
        toast.error('Error fetching expenses');
      }
    })();
  }, [setData, refreshTrigger]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              {/* Will add later if i want to add chart */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              <AddExpense />
              <div className="px-4 lg:px-6">
                <DataTable columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
