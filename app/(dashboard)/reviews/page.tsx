"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, Star, Search, Globe, User, Quote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { reviewService, Review } from "@/services/reviewService";
import Image from "next/image";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getAll();
            setReviews(Array.isArray(data) ? data : (data as any)?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this client review?")) return;
        try {
            await reviewService.delete(id);
            setReviews((prev) => prev.filter((item) => item._id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete review");
        }
    };

    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            const authorMatch = r.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
            const projectMatch = r.title_project?.toLowerCase().includes(searchQuery.toLowerCase());
            const countryMatch = r.country?.toLowerCase().includes(searchQuery.toLowerCase());
            const reviewMatch = r.review?.toLowerCase().includes(searchQuery.toLowerCase());
            return authorMatch || projectMatch || countryMatch || reviewMatch;
        });
    }, [reviews, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[#EF4444] animate-spin" />
                <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider animate-pulse">Loading Reviews...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header section with search and add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-zinc-50">Reviews</h2>
                    <p className="text-xs text-zinc-400 font-medium">Manage client feedback and project testimonials displayed on your portfolio.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <Input
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-xs rounded-xl"
                        />
                    </div>
                    <Link href="/reviews/new" className="shrink-0">
                        <Button className="h-10 rounded-xl px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Review
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Reviews Cards Grid */}
            {filteredReviews.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto border border-dashed rounded-[24px] dark:border-zinc-800 p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center justify-center mx-auto text-zinc-400">
                        <Star className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold uppercase tracking-wider text-sm text-zinc-800 dark:text-zinc-200">No Reviews Found</h3>
                        <p className="text-xs text-zinc-400">
                            {searchQuery ? "No reviews matched your search filters." : "Publish testimonials from your past clients and project partners."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredReviews.map((item) => (
                        <div 
                            key={item._id} 
                            className="group relative flex flex-col bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 justify-between"
                        >
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-6 right-6 text-zinc-100 dark:text-zinc-800/40 group-hover:scale-110 transition-transform">
                                <Quote className="h-8 w-8 rotate-180 fill-current" />
                            </div>

                            <div className="space-y-4">
                                {/* Rating Stars */}
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-4 w-4 ${i < item.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} 
                                        />
                                    ))}
                                </div>

                                {/* Review content snippet */}
                                <p className="text-xs font-medium text-zinc-650 dark:text-zinc-450 line-clamp-4 leading-relaxed italic">
                                    &ldquo;{item.review}&rdquo;
                                </p>
                            </div>

                            {/* Client Profiler Details */}
                            <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-6 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border bg-zinc-50 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                                        {item.author_profile_image ? (
                                            <Image 
                                                fill 
                                                src={item.author_profile_image} 
                                                alt={item.author_name} 
                                                className="object-cover" 
                                                unoptimized
                                            />
                                        ) : (
                                            <User className="h-4.5 w-4.5" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate uppercase">
                                            {item.author_name}
                                        </span>
                                        <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Globe className="h-3 w-3 text-zinc-400" />
                                            {item.country || "Remote"} / {item.title_project || "Client"}
                                        </span>
                                    </div>
                                </div>

                                {/* Control Actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Link href={`/reviews/${item._id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-colors"
                                        onClick={() => onDelete(item._id)}
                                    >
                                        <Trash className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
