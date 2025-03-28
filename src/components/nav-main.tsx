"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";


interface NavItem {
  name: string;
  url: string;
  icon?: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface NavMainProps {
  items: NavSection[];
  currentPath?: string;
  className?: string;
}

export function NavMain({ items, currentPath = "", className }: NavMainProps) {
  const { isMobile } = useSidebar();

  const isActive = (url: string) => {
    if (url === "/dashboard" && currentPath === "/dashboard") {
      return true;
    }

    if (url !== "/dashboard" && currentPath.startsWith(url)) {
      return true;
    }

    return false;
  };

  return (
    <div className={className}>
      {items.map((section, index) => (
        <SidebarGroup
          key={index}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && (
                      <div className="flex size-5 items-center justify-center">
                        <item.icon className="size-4" />
                      </div>
                    )}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
