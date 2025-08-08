"use client"

import {
  IconBrandGithub,
  IconBrandX,
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

type Item = {
  name: string;
  url: string;
  icon: Icon;
}

export function NavDocuments() {
  const items: Item[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/M-SaaD-H',
      icon: IconBrandGithub,
    },
    {
      name: 'X',
      url: 'https://x.com/_MSaaDH',
      icon: IconBrandX,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden my-8">
      <SidebarGroupLabel>Developed By</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className=''>
            <SidebarMenuButton asChild>
              <Link href={item.url} target="_blank" className="space-x-1">
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
