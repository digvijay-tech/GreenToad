"use client";


import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";


export function ManageWorkspaces() {
    return (
        <Card className="h-full shadow-none flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Manage Workspace</CardTitle>
                <CardDescription>
                    You can rename, delete, and view your workspaces. Currently, you have X workspaces.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <Button className="w-full">
                        <Edit2Icon className="h-4 w-4" />
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
