'use client';

import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { columns, Expense } from "@/components/columns"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AddExpense } from "@/components/AddExpense";
import { useUserExpensesStore } from "@/store/userExpensesStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";

export default function Page() {
  const { expenses, isFetchingExpenses, fetchUserExpenses } = useUserExpensesStore();
  const { data: session } = useSession();
  const [selectedSem, setSelectedSem] = useState<string>(session?.user.activeSem?.toString() || "1");

  useEffect(() => {
    if (session?.user?.activeSem) {
      fetchUserExpenses(session.user.activeSem);
      setSelectedSem(session.user.activeSem.toString());
    }
  }, [fetchUserExpenses, session?.user?.activeSem]);

  const handleSemesterChange = (value: string) => {
    setSelectedSem(value);
    fetchUserExpenses(parseInt(value));
  };

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
              <div className="flex justify-between items-center px-4 lg:px-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Balance</h2>
                  <Badge variant="outline">Semester {session?.user.activeSem || 1}</Badge>
                </div>
              </div>
              <SectionCards />
              {/* Will add later if i want to add chart */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              <div className="flex justify-between mx-8">
                <Select value={selectedSem} onValueChange={handleSemesterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={"Semester " + selectedSem} />
                  </SelectTrigger>
                  <SelectContent>
                  {Array.from({ length: session?.user?.activeSem || 1 }, (_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={(i + 1).toString()}
                    >
                      Semester {i + 1}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                <AddExpense />
              </div>
              <div className="px-4 lg:px-6">
                {
                  !isFetchingExpenses ? (
                    <DataTable columns={columns} data={expenses as Expense[]} />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center mx-auto">
                      <Loader2 className="animate-spin mx-auto" size={64} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
