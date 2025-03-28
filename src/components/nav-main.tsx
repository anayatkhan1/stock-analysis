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

// Define the correct type structure to match the data in app-sidebar.tsx
interface NavItem {
  name: string;
  url: string;
  icon?: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function NavMain({ items }: { items: NavSection[] }) {
  const { isMobile } = useSidebar();

  return (
    <div>
      {items.map((section, index) => (
        <SidebarGroup
          key={index}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
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
