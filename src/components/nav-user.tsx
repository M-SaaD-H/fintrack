"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

export function NavUser({
  user,
}: {
  user?: {
    fullName: {
      firstName: string,
      lastName: string,
    },
    email: string,
    image: string,
  }
}) {
  const { isMobile } = useSidebar()

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if(user) setIsLoading(false);
  }, [user])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {
                !isLoading ? (
                  <Avatar className="h-8 w-8 rounded-lg grayscale flex justify-center items-center">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-zinc-100 text-zinc-900">
                      {user?.fullName.firstName.charAt(0)}
                      {user?.fullName.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="w-8 h-full" />
                )
              }
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {
                    !isLoading ? (
                      user?.fullName.firstName
                    ) : (
                      <Skeleton className="h-4 w-full rounded-xs" />
                    )
                  }
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {
                    !isLoading ? (
                      user?.email
                    ) : (
                      <Skeleton className="h-2 mt-1 w-full rounded-xs" />
                    )
                  }
                </span>
              </div>
              {
                !isLoading && <IconDotsVertical className="ml-auto size-4" />
              }
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg grayscale flex justify-center items-center">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="bg-zinc-100 text-zinc-900">
                    {user?.fullName.firstName.charAt(0) || 'A'}
                    {user?.fullName.lastName.charAt(0) || 'B'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName.firstName || 'User'}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email || 'user@gmail.com'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
