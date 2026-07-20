"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, Search, FileText, User, Tag, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { blogService, Blog } from "@/services/blogService";
import Image from "next/image";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogs = async () => {
        try {
            const data = await blogService.getAll();
            setBlogs(Array.isArray(data) ? data : (data as any)?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await blogService.delete(id);
            setBlogs((prev) => prev.filter((item) => item._id !== id));
            toast.success("Blog deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete blog");
        }
    };

    const filteredBlogs = useMemo(() => {
        return blogs.filter(b => {
            const titleEnMatch = b.title?.en?.toLowerCase().includes(searchQuery.toLowerCase());
            const titleZhMatch = b.title?.zh?.toLowerCase().includes(searchQuery.toLowerCase());
            const authorMatch = b.author?.toLowerCase().includes(searchQuery.toLowerCase());
            const slugMatch = b.slug?.toLowerCase().includes(searchQuery.toLowerCase());
            return titleEnMatch || titleZhMatch || authorMatch || slugMatch;
        });
    }, [blogs, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[#EF4444] animate-spin" />
                <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider animate-pulse">Loading Blogs...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header section with search and add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-zinc-50">Blogs</h2>
                    <p className="text-xs text-zinc-400 font-medium">Create and manage content articles for the saasfactry website.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <Input
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-xs rounded-xl"
                        />
                    </div>
                    <Link href="/blogs/new" className="shrink-0">
                        <Button className="h-10 rounded-xl px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Write Article
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Blogs Grid */}
            {filteredBlogs.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto border border-dashed rounded-[24px] dark:border-zinc-800 p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center mx-auto text-zinc-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">No Articles Found</h3>
                        <p className="text-xs text-zinc-400">
                            {searchQuery ? "No articles matched your search query." : "Write your first blog post to publish on the public portfolio."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog) => (
                        <div 
                            key={blog._id} 
                            className="group flex flex-col bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                        >
                            {/* Card Cover Image */}
                            <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b dark:border-zinc-850">
                                {blog.cover_image ? (
                                    <Image
                                        src={blog.cover_image}
                                        alt={blog.slug}
                                        fill
                                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                        <FileText className="h-10 w-10 stroke-[1.5]" />
                                    </div>
                                )}
                                
                                {/* Overlay Slug Badge */}
                                <div className="absolute bottom-3 left-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-black/85 dark:bg-zinc-950/95 text-white rounded-lg border border-zinc-850">
                                        <Tag className="h-3 w-3 text-red-500" />
                                        <span>/{blog.slug}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    {/* Dual-language Title Display */}
                                    <h3 className="font-extrabold uppercase tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-500 transition-colors text-sm line-clamp-1">
                                        {blog.title?.en}
                                    </h3>
                                    {blog.title?.zh && (
                                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                                            中文标题: {blog.title.zh}
                                        </p>
                                    )}
                                </div>

                                {/* Author Profile Footer */}
                                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            {blog.author}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link href={`/blogs/${blog._id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-colors"
                                            onClick={() => onDelete(blog._id)}
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
