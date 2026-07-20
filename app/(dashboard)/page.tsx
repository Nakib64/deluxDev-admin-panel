"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    FolderKanban, 
    FileText, 
    Star, 
    Plus, 
    Sparkles, 
    Code, 
    Clock,
    ChevronRight
} from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import { portfolioService, Portfolio } from "@/services/portfolioService";
import { blogService, Blog } from "@/services/blogService";
import { reviewService } from "@/services/reviewService";
import { techService } from "@/services/techService";
import Image from "next/image";

export default function DashboardPage() {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState("Welcome back");
    const [currentTime, setCurrentTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [recentProjects, setRecentProjects] = useState<Portfolio[]>([]);
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [stats, setStats] = useState({
        portfolios: 0,
        blogs: 0,
        reviews: 0,
        tech: 0
    });

    useEffect(() => {
        // Set dynamic greeting based on local time
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        // Format date and time
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentTime(new Date().toLocaleDateString("en-US", options));

        // Fetch metrics and recent items
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [projectsData, blogsData, reviewsData, techData] = await Promise.all([
                    portfolioService.getAll().catch(() => []),
                    blogService.getAll().catch(() => []),
                    reviewService.getAll().catch(() => []),
                    techService.getAll().catch(() => [])
                ]);

                const resolvedProjects = Array.isArray(projectsData) ? projectsData : (projectsData as any)?.data || [];
                const resolvedBlogs = Array.isArray(blogsData) ? blogsData : (blogsData as any)?.data || [];
                const resolvedReviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData as any)?.data || [];
                const resolvedTech = Array.isArray(techData) ? techData : (techData as any)?.data || [];

                setStats({
                    portfolios: resolvedProjects.length,
                    blogs: resolvedBlogs.length,
                    reviews: resolvedReviews.length,
                    tech: resolvedTech.length
                });

                // Take latest 3 projects & blogs
                setRecentProjects(resolvedProjects.slice(0, 3));
                setRecentBlogs(resolvedBlogs.slice(0, 3));
            } catch (err) {
                console.error("Error loading dashboard metrics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        {
            title: "Total Portfolios",
            value: stats.portfolios,
            icon: FolderKanban,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-950/40",
            description: "Projects showcase gallery"
        },
        {
            title: "Total Blogs",
            value: stats.blogs,
            icon: FileText,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950/40",
            description: "Articles & technical writings"
        },
        {
            title: "Total Reviews",
            value: stats.reviews,
            icon: Star,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-950/40",
            description: "Client feedback & testimonials"
        },
        {
            title: "Tech Stack",
            value: stats.tech,
            icon: Code,
            color: "text-sky-600 dark:text-sky-400",
            bg: "bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-950/40",
            description: "Registered technologies"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header Greeting Banner */}
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-black p-6 md:p-8 text-white shadow-lg border border-zinc-800">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span>System Dashboard</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                            {greeting}, {user?.name || "Admin"}!
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{currentTime}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/portfolios/new">
                            <button className="h-10 px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95">
                                <Plus className="h-4 w-4" />
                                Add Portfolio
                            </button>
                        </Link>
                        <Link href="/blogs/new">
                            <button className="h-10 px-4 text-xs font-bold uppercase tracking-wider bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95">
                                <FileText className="h-4 w-4" />
                                Write Blog
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div 
                            key={index} 
                            className={`p-6 rounded-[24px] border bg-white dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] group ${card.bg}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 transition-colors">
                                        {card.title}
                                    </p>
                                    {loading ? (
                                        <div className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                                    ) : (
                                        <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                            {card.value}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800/80 group-hover:scale-110 transition-transform ${card.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 font-medium">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Items Flex Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Portfolios */}
                <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">
                                    Latest Portfolios
                                </h3>
                            </div>
                            <Link href="/portfolios" className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 group/link">
                                View All
                                <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-center animate-pulse">
                                        <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-2.5 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentProjects.length === 0 ? (
                            <div className="py-8 text-center text-xs text-zinc-400 border border-dashed rounded-xl dark:border-zinc-800">
                                No portfolio projects created yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentProjects.map((project) => (
                                    <div key={project._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/60 transition-all duration-300">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {project.title_image && (
                                                <div className="relative h-10 w-16 rounded-xl overflow-hidden shrink-0 border dark:border-zinc-800 bg-zinc-100">
                                                    <Image 
                                                        fill 
                                                        src={project.title_image} 
                                                        alt={project.title} 
                                                        className="object-cover" 
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate uppercase">
                                                    {project.title}
                                                </h4>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                                    {project.technologies?.[0]?.name || "Project"}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/portfolios/${project._id}`}>
                                            <button className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors">
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Blogs */}
                <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">
                                    Recent Articles
                                </h3>
                            </div>
                            <Link href="/blogs" className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 group/link">
                                View All
                                <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-center animate-pulse">
                                        <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-2.5 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentBlogs.length === 0 ? (
                            <div className="py-8 text-center text-xs text-zinc-400 border border-dashed rounded-xl dark:border-zinc-800">
                                No blog posts written yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBlogs.map((blog) => (
                                    <div key={blog._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/60 transition-all duration-300">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {blog.cover_image && (
                                                <div className="relative h-10 w-16 rounded-xl overflow-hidden shrink-0 border dark:border-zinc-800 bg-zinc-100">
                                                    <Image 
                                                        fill 
                                                        src={blog.cover_image} 
                                                        alt={blog.slug} 
                                                        className="object-cover" 
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate uppercase">
                                                    {blog.title.en}
                                                </h4>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                                    By {blog.author}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/blogs/${blog._id}`}>
                                            <button className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors">
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
