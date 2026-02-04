"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { reviewService, Review } from "@/services/reviewService";
import Image from "next/image";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getAll();
            setReviews(Array.isArray(data) ? data : []);
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
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await reviewService.delete(id);
            setReviews((prev) => prev.filter((item) => item._id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete review");
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
                <Link href="/reviews/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        {item.author_profile_image && (
                                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                <Image
                                                    src={item.author_profile_image}
                                                    alt={item.author_name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        {item.author_name}
                                    </TableCell>
                                    <TableCell>{item.title_project}</TableCell>
                                    <TableCell>{item.rating} / 5</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/reviews/${item._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onDelete(item._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
