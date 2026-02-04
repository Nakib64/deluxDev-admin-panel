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
import { portfolioService, Portfolio } from "@/services/portfolioService";
import Image from "next/image";

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPortfolios = async () => {
        try {
            const data = await portfolioService.getAll();
            setPortfolios(Array.isArray(data) ? data : []); // Handle potential wrap
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
        if (!confirm("Are you sure you want to delete this portfolio?")) return;
        try {
            await portfolioService.delete(id);
            setPortfolios((prev) => prev.filter((item) => item._id !== id));
            toast.success("Portfolio deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete portfolio");
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Portfolios</h2>
                <Link href="/portfolios/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {portfolios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            portfolios.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <div className="relative h-12 w-20 overflow-hidden rounded-md">
                                            <Image
                                                src={item.title_image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="max-w-md truncate">{item.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/portfolios/${item._id}`}>
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
