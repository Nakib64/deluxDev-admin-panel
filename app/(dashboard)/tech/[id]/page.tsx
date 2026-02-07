"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { techService } from "@/services/techService";
import Link from "next/link";

interface TechFormValues {
    name: string;
    icon: string;
}

export default function TechFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [iconFile, setIconFile] = useState<File | null>(null);

    const isNew = params.id === "new";
    const title = isNew ? "Create Tech Item" : "Edit Tech Item";
    const action = isNew ? "Create" : "Save changes";

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TechFormValues>({
        defaultValues: {
            name: "",
            icon: "",
        },
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            techService.getOne(params.id as string)
                .then((data) => {
                    setValue("name", data.name);
                    setValue("icon", data.icon);
                })
                .catch(() => {
                    toast.error("Failed to load tech item");
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: TechFormValues) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", data.name);

            if (iconFile) {
                formData.append("icon", iconFile);
            }

            if (isNew) {
                await techService.create(formData);
                toast.success("Tech item created");
            } else {
                await techService.update(params.id as string, formData);
                toast.success("Tech item updated");
            }
            router.push("/tech");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isNew) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/tech">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                </div>
                <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
                    <Save className="mr-2 h-4 w-4" />
                    {action}
                </Button>
            </div>

            <div className="space-y-4 border p-4 rounded-md">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Technology Name</label>
                    <Input disabled={loading} placeholder="e.g. React" {...register("name", { required: true })} />
                    {errors.name && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Icon (PNG/SVG)</label>
                    <ImageUpload
                        value={watch("icon")}
                        onChange={(url) => setValue("icon", url as string)}
                        onRemove={() => {
                            setValue("icon", "");
                            setIconFile(null);
                        }}
                        onFilesChange={(files) => setIconFile(files[0])}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
}
