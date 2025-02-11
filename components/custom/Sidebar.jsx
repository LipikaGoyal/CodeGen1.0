"use client"

import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter, useParams } from 'next/navigation';
import { Menu, Plus, Search, Trash2, X, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import { UserDetailsContext } from '@/context/UserDetailContext';
import { useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Sidebar() {
    const router = useRouter();
    const params = useParams();
    const { userDetails } = useContext(UserDetailsContext);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const workspaces = useQuery(api.workspace.GetUserWorkspaces, { 
        userId: userDetails?._id 
    });

    const filteredWorkspaces = workspaces?.filter(workspace => 
        workspace?.messages[0]?.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                    <SidebarContent 
                        workspaces={filteredWorkspaces} 
                        router={router}
                        search={search}
                        setSearch={setSearch}
                        onSelect={() => setOpen(false)}
                        currentWorkspaceId={params?.id}
                    />
                </SheetContent>
            </Sheet>
            <div className="hidden md:block">
                <SidebarContent 
                    workspaces={filteredWorkspaces} 
                    router={router}
                    search={search}
                    setSearch={setSearch}
                    currentWorkspaceId={params?.id}
                />
            </div>
        </>
    )
}

function SidebarContent({ workspaces, router, search, setSearch, onSelect, currentWorkspaceId }) {
    return (
        <div className="w-[300px] border-r h-screen bg-muted/10">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-2">
                        <Code2 className="h-6 w-6 text-primary mr-2" />
                        <h2 className="text-lg font-semibold">
                            CodeGen
                        </h2>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="ml-auto"
                            onClick={() => {
                                router.push('/');
                                onSelect?.();
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="px-2 mt-4">
                        <div className="flex items-center px-2 h-9 rounded-md border bg-background">
                            <Search className="h-4 w-4 text-muted-foreground mr-2" />
                            <Input
                                placeholder="Search workspaces..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                            />
                        </div>
                    </div>
                    <Separator className="my-4" />
                </div>
                <div className="px-3">
                    <ScrollArea className="h-[calc(100vh-12rem)] px-1">
                        <div className="space-y-1">
                            {workspaces?.map((workspace, index) => (
                                <div
                                    key={workspace._id}
                                    onClick={() => {
                                        router.push('/workspace/' + workspace._id);
                                        onSelect?.();
                                    }}
                                    className={cn(
                                        'p-3 cursor-pointer rounded-lg flex justify-between items-center group transition-colors',
                                        workspace._id === currentWorkspaceId 
                                            ? 'bg-accent' 
                                            : 'hover:bg-muted/50',
                                    )}
                                >
                                    <h2 className='text-sm line-clamp-1 flex-1'>
                                        {workspace?.messages[0]?.content || `Workspace ${index + 1}`}
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Add delete functionality
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

export default Sidebar 