"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
                <p className="text-muted-foreground mb-6">
                    Unable to load the dashboard. Please try again.
                </p>
                {error.digest && (
                    <p className="text-sm text-muted-foreground mb-6">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset}>Try again</Button>
                    <Button variant="outline" onClick={() => window.location.href = "/"}>
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    );
}
