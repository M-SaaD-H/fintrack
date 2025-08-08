"use client"

import {
  IconBook,
  IconDotsVertical,
  IconLogout,
  IconMinus,
  IconPlus,
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
import { signOut, useSession } from "next-auth/react"
import { SetStateAction, useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { Dialog, DialogDescription, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { ApiResponse } from "@/utils/apiResponse"
import axios, { AxiosError } from "axios"
import { useUserExpensesStore } from "@/store/userExpensesStore"

export function NavUser({
  user,
}: {
  user?: {
    fullName: {
      firstName: string,
      lastName: string,
    },
    email: string,
    activeSem: number,
    image: string,
  }
}) {
  const { isMobile } = useSidebar()

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(user) setIsLoading(false);
  }, [user])

  return (
    <>
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
                <DropdownMenuItem onClick={() => setIsDialogOpen(prev => !prev)}>
                  <IconBook />
                  Update Sem
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
      {
        user && <UpdateSem isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} userActiveSem={user.activeSem} />
      }
    </>
  )
}

const UpdateSem = ({
  isDialogOpen,
  setIsDialogOpen,
  userActiveSem
}: {
  isDialogOpen: boolean,
  setIsDialogOpen: (open: boolean) => void,
  userActiveSem: number
}) => {
  const [sem, setSem] = useState(userActiveSem);
  const { fetchUserExpenses, setCurrentSem } = useUserExpensesStore();
  const { data: session, update } = useSession();

  const handleSubmit = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/user/sem', { sem });

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh expenses for the new semester
        await fetchUserExpenses(sem);
        // Update session to reflect the new semester
        await update();
        setCurrentSem(sem);
      }
    } catch (error) {
      console.log('Error updating sem E:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error('Error updating sem', {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px] mt12" forceMount>
        <DialogHeader>
          <DialogTitle>Update Sem</DialogTitle>
          <DialogDescription>
            Update your semester to keep your expense tracking accurate for each term.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <div className="flex gap-4 justify-center items-center mt-6">
            <Button
              type="button"
              className="size-10"
              onClick={() => {
                setSem(prev => {
                  if (prev - 1 < userActiveSem) {
                    return prev;
                  }

                  return prev - 1
                })
              }}
            >
              <IconMinus />
            </Button>
            <Input
              className="size-10"
              value={sem}
              onChange={(e) => {
                const newSem = parseInt(e.target.value);
                if (newSem > sem) {
                  toast.error("Invalid Sem", {
                    description: "New Sem have to be greater than your current active sem."
                  })

                  return;
                }

                setSem(newSem);
              }
              }
            />
            <Button
              type="button"
              className="size-10"
              onClick={() => {
                setSem(prev => prev + 1)
              }}
            >
              <IconPlus />
            </Button>
          </div>
          <Button type="submit" className="mt-4 w-full" onClick={() => setIsDialogOpen(false)}>Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}