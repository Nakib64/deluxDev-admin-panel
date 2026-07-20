"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, Search, Code, Cpu } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { techService, Tech } from "@/services/techService";

export default function TechPage() {
    const [techs, setTechs] = useState<Tech[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTechs = async () => {
        try {
            const data = await techService.getAll();
            setTechs(Array.isArray(data) ? data : (data as any)?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tech stack");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechs();
    }, []);

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tech item?")) return;
        try {
            await techService.delete(id);
            setTechs((prev) => prev.filter((item) => item._id !== id));
            toast.success("Tech item deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete tech item");
        }
    };

    const filteredTechs = useMemo(() => {
        return techs.filter(t => {
            const nameMatch = t.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const catMatch = t.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return nameMatch || catMatch;
        });
    }, [techs, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[#EF4444] animate-spin" />
                <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider animate-pulse">Loading Tech Stack...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header section with search and add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-zinc-50">Tech Stack</h2>
                    <p className="text-xs text-zinc-400 font-medium">Manage the technologies shown on the portfolio filtering and info sections.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <Input
                            placeholder="Search technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-xs rounded-xl"
                        />
                    </div>
                    <Link href="/tech/new" className="shrink-0">
                        <Button className="h-10 rounded-xl px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Tech
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tech Stack Grid */}
            {filteredTechs.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto border border-dashed rounded-[24px] dark:border-zinc-800 p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center mx-auto text-zinc-400">
                        <Code className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">No Technologies Found</h3>
                        <p className="text-xs text-zinc-400">
                            {searchQuery ? "No tech items matched your search filters." : "Register your core development technologies and framework assets."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredTechs.map((tech) => (
                        <div 
                            key={tech._id} 
                            className="group relative flex flex-col bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[20px] p-5 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-350 items-center justify-between space-y-4 text-center"
                        >
                            {/* Tech Icon Container */}
                            <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300 relative">
                                {tech.icon ? (
                                    <img 
                                        src={tech.icon} 
                                        alt={tech.name} 
                                        className="h-full w-full object-contain" 
                                    />
                                ) : (
                                    <Cpu className="h-6 w-6 text-zinc-400" />
                                )}
                            </div>

                            {/* Tech Details */}
                            <div className="space-y-1 w-full">
                                <h3 className="font-extrabold uppercase tracking-tight text-zinc-800 dark:text-zinc-200 text-xs truncate">
                                    {tech.name}
                                </h3>
                                <span className="inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md">
                                    {tech.category || "General"}
                                </span>
                            </div>

                            {/* Hover Actions Bar */}
                            <div className="flex items-center justify-center gap-1.5 w-full pt-2 border-t border-zinc-100/80 dark:border-zinc-800/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Link href={`/tech/${tech._id}`}>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200">
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-colors"
                                    onClick={() => onDelete(tech._id)}
                                >
                                    <Trash className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
