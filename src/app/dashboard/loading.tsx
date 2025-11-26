"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLoading() {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <Skeleton className="h-10 w-full" />
                </SidebarHeader>
                <SidebarContent>
                    <div className="space-y-2 p-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <Skeleton className="h-10 w-full" />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-1 mx-2" />
                    <Skeleton className="h-4 w-48" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <Skeleton className="aspect-video rounded-xl" />
                        <Skeleton className="aspect-video rounded-xl" />
                        <Skeleton className="aspect-video rounded-xl" />
                    </div>
                    <Skeleton className="min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
