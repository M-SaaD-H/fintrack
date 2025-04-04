'use client'

import { IconBrandGoogle, IconCashBanknote } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShoppingBag, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse } from "@/utils/apiResponse";
import { useRefresh } from "@/context/RefreshContext";

function formatDate(date: Date | string) {
  if(typeof window === 'undefined') return '';

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

export function SectionCards() {
  const { refreshTrigger } = useRefresh();
  const [info, setInfo] = useState<infoType>();

  const [lastCashSpentDate, setLastCashSpentDate] = useState<string>('');
  const [lastUpiSpentDate, setLastUpiSpentDate] = useState<string>('');

  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<ApiResponse>('/api/expense/get-info');

        if(res.data.success) {
          setInfo(res.data.data as infoType);
        }
      } catch (error) {
        console.error('Error fetching info E:', error);
      }
    })();
  }, [setInfo, refreshTrigger]);

  useEffect(() => {
    if(!info) return;

    const lastCashSpentDate = formatDate(info.spentInfo?.cash?.lastSpentDate);
    const lastUpiSpentDate = formatDate(info.spentInfo?.upi?.lastSpentDate);

    const lastCashUpdatedAt = formatDate(info.currentInfo?.cash?.updatedAt);
    const lastUpiUpdatedAt = formatDate(info.currentInfo?.upi?.updatedAt);

    setLastCashSpentDate(lastCashSpentDate);
    setLastUpiSpentDate(lastUpiSpentDate);
    
    const lastUpdatedAt = info.currentInfo?.cash?.updatedAt > info.currentInfo?.upi?.updatedAt ? lastCashUpdatedAt : lastUpiUpdatedAt;
    setLastUpdatedAt(lastUpdatedAt);
  }, [info]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { (info?.currentInfo.cash.amount || 0) + (info?.currentInfo.upi.amount || 0) } <span className="text-muted-foreground text-xl">Rs</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Wallet />
              Available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Combined UPI & Cash Balance
          </div>
          <div className="text-muted-foreground">
            Last Added: {
              lastUpdatedAt !== 'Invalid Date' && `${lastUpdatedAt}`
            }
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>UPI Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {info?.currentInfo.upi.amount || 0} <span className="text-muted-foreground text-xl">Rs</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBrandGoogle />
              GPay
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Digital balance
          </div>
          <div className="text-muted-foreground">
            Last Spent: {lastUpiSpentDate}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cash Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {info?.currentInfo.cash.amount || 0} <span className="text-muted-foreground text-xl">Rs</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCashBanknote />
              Cash
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Physical cash in hand
          </div>
          <div className="text-muted-foreground">
            Last Spent: {lastCashSpentDate}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Spent this Sem</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { (info?.spentInfo?.cash?.totalAmountSpent || 0) + (info?.spentInfo?.upi?.totalAmountSpent || 0) } <span className="text-muted-foreground text-xl">Rs</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShoppingBag />
              Total Spent
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Amount spent this Sem
          </div>
          <div className="text-muted-foreground">
            {info?.spentInfo?.cash?.totalAmountSpent || 0} in cash, {info?.spentInfo?.upi?.totalAmountSpent || 0} in UPI
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
