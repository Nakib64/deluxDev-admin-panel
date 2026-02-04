"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { LayoutDashboard, FolderKanban, FileText, Star } from "lucide-react";

export const Navbar = () => {
    const pathname = usePathname();

    const routes = [
        {
            href: "/portfolios",
            label: "Portfolios",
            icon: FolderKanban,
            active: pathname === "/portfolios",
        },
        {
            href: "/blogs",
            label: "Blogs",
            icon: FileText,
            active: pathname === "/blogs",
        },
        {
            href: "/reviews",
            label: "Reviews",
            icon: Star,
            active: pathname === "/reviews",
        },
    ];

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>AdminPanel</span>
                </Link>
                <div className="flex items-center gap-4 transition-all">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                route.active
                                    ? "text-black dark:text-white"
                                    : "text-muted-foreground"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                    <Link href="/portfolios/new">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
