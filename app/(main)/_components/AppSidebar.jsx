'use client'

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="flex items-center mt-5">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[150px]"
        />
        <Button className="w-full mt-5">
          <Plus />
          Create New Interval
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => {
                const isActive = path === option.path;
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full px-4 py-2 rounded-md flex items-center gap-3 transition-colors ${
                        isActive
                          ? 'bg-blue-300'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Link href={option.path}>
                        <option.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{option.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
