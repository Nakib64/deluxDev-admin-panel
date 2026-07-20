"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    FolderKanban, 
    FileText, 
    Star, 
    Settings, 
    LogOut,
    Sparkles
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "Portfolios",
        icon: FolderKanban,
        href: "/portfolios",
    },
    {
        label: "Blogs",
        icon: FileText,
        href: "/blogs",
    },
    {
        label: "Reviews",
        icon: Star,
        href: "/reviews",
    },
    {
        label: "Categories",
        icon: Settings,
        href: "/categories",
    },
    {
        label: "Tech Stack",
        icon: Settings,
        href: "/tech",
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] shadow-sm p-4 justify-between">
            <div className="flex-1 flex flex-col">
                {/* Brand Logo - Styled like Bress */}
                <Link href="/" className="flex items-center gap-3 pl-3 py-4 mb-8">
                    <div className="h-9 w-9 rounded-xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 font-black shadow-md">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
                        saasfactry
                    </span>
                </Link>
                
                {/* Navigation Links */}
                <div className="space-y-1">
                    {routes.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 rounded-[16px]",
                                    isActive 
                                        ? "text-white bg-[#0E1325] dark:bg-zinc-100 dark:text-zinc-950 shadow-md scale-[1.02]" 
                                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3 transition-colors", 
                                        isActive ? "text-red-500" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                                    )} />
                                    {route.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* User Profile / Logout Section */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm uppercase">
                        {user?.name?.[0] || "A"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate uppercase tracking-tight">
                            {user?.name || "Admin"}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                            {user?.email || "admin@saasfactry.com"}
                        </span>
                    </div>
                </div>
                
                <button
                    onClick={logout}
                    className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
