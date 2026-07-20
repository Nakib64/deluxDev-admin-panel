"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, ExternalLink, Github, Search, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { portfolioService, Portfolio } from "@/services/portfolioService";
import Image from "next/image";

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPortfolios = async () => {
        try {
            const data = await portfolioService.getAll();
            setPortfolios(Array.isArray(data) ? data : (data as any)?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch portfolios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio project?")) return;
        try {
            await portfolioService.delete(id);
            setPortfolios((prev) => prev.filter((item) => item._id !== id));
            toast.success("Portfolio deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete portfolio");
        }
    };

    const stripHtml = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '');
    };

    const filteredPortfolios = useMemo(() => {
        return portfolios.filter(p => {
            const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const techMatch = p.technologies?.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
            return titleMatch || descMatch || techMatch;
        });
    }, [portfolios, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[#EF4444] animate-spin" />
                <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider animate-pulse">Loading Portfolios...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header section with search and add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-zinc-50">Portfolios</h2>
                    <p className="text-xs text-zinc-400 font-medium">Manage and display showcase projects on the portfolio frontend.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-xs rounded-xl"
                        />
                    </div>
                    <Link href="/portfolios/new" className="shrink-0">
                        <Button className="h-10 rounded-xl px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Portfolio Cards Grid */}
            {filteredPortfolios.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto border border-dashed rounded-[24px] dark:border-zinc-800 p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center mx-auto text-zinc-400">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">No Projects Found</h3>
                        <p className="text-xs text-zinc-400">
                            {searchQuery ? "No portfolios matched your search terms. Try refining your search query." : "Get started by adding your first showcase portfolio project."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPortfolios.map((project) => (
                        <div 
                            key={project._id} 
                            className="group flex flex-col bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                        >
                            {/* Card Cover Image */}
                            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b dark:border-zinc-850">
                                {project.title_image ? (
                                    <Image
                                        src={project.title_image}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                        <Briefcase className="h-10 w-10 stroke-[1.5]" />
                                    </div>
                                )}
                                
                                {/* Overlay Badges */}
                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-black/80 dark:bg-zinc-900/90 text-white rounded-lg shadow-sm border border-zinc-800/30">
                                        {project.technologies?.[0]?.name || "Project"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-extrabold uppercase tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-500 transition-colors text-sm line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                                        {stripHtml(project.description)}
                                    </p>
                                </div>

                                {/* Tech stack tags list */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex items-center gap-1.5 overflow-hidden py-1 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                                        {project.technologies.slice(0, 4).map((tech, i) => (
                                            <div 
                                                key={i} 
                                                className="h-6 w-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center text-zinc-400"
                                                title={tech.name}
                                            >
                                                <img src={tech.image} alt={tech.name} className="h-3.5 w-3.5 object-contain" />
                                            </div>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="text-[9px] font-bold text-zinc-400 ml-1">
                                                +{project.technologies.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons Footer */}
                                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                                    <div className="flex items-center gap-1.5">
                                        {project.live_link && (
                                            <a 
                                                href={project.live_link} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors border"
                                                title="Live Preview"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                        {project.github_link && (
                                            <a 
                                                href={project.github_link} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors border"
                                                title="GitHub Repository"
                                            >
                                                <Github className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/portfolios/${project._id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-colors"
                                            onClick={() => onDelete(project._id)}
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
