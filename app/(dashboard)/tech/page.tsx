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
import { techService, Tech } from "@/services/techService";
import Image from "next/image";

export default function TechPage() {
    const [techs, setTechs] = useState<Tech[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTechs = async () => {
        try {
            const data = await techService.getAll();
            setTechs(Array.isArray(data) ? data : []);
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

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
                <Link href="/tech/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {techs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            techs.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                            <Image
                                                src={item.icon}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/tech/${item._id}`}>
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
