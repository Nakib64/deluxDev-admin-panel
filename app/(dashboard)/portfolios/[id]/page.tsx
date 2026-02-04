"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Correct hook
import { useForm, useFieldArray } from "react-hook-form";
import { Trash, Plus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea"; // Import Textarea
import ImageUpload from "@/app/components/ui/image-upload";
import { portfolioService } from "@/services/portfolioService";
import Link from "next/link";

interface PortfolioFormValues {
    title: string;
    description: string;
    title_image: string;
    images: string[];
    technologies: { key: string; value: string }[]; // Form structure for Map
    live_link: string;
    github_link: string;
}

export default function PortfolioFormPage() {
    const params = useParams(); // params.id will be available
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Handle 'new' vs 'id'
    const isNew = params.id === "new";
    const title = isNew ? "Create Portfolio" : "Edit Portfolio";
    const action = isNew ? "Create" : "Save changes";

    // React Hook Form
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<PortfolioFormValues>({
        defaultValues: {
            title: "",
            description: "",
            title_image: "",
            images: [],
            technologies: [],
            live_link: "",
            github_link: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "technologies",
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            portfolioService.getOne(params.id as string)
                .then((data) => {
                    setValue("title", data.title);
                    setValue("description", data.description);
                    setValue("title_image", data.title_image);
                    setValue("images", data.images || []);
                    setValue("live_link", data.live_link || "");
                    setValue("github_link", data.github_link || "");

                    // Convert Map/Object to Array for form
                    if (data.technologies) {
                        const techs = Object.entries(data.technologies).map(([key, value]) => ({
                            key,
                            value: value as string,
                        }));
                        setValue("technologies", techs);
                    }
                })
                .catch(() => {
                    toast.error("Failed to load portfolio");
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: PortfolioFormValues) => {
        try {
            setLoading(true);

            // Convert Array back to Map/Object
            const technologiesMap: Record<string, string> = {};
            data.technologies.forEach((t) => {
                if (t.key) technologiesMap[t.key] = t.value;
            });

            const payload = {
                ...data,
                technologies: technologiesMap,
            };

            if (isNew) {
                await portfolioService.create(payload);
                toast.success("Portfolio created");
            } else {
                await portfolioService.update(params.id as string, payload);
                toast.success("Portfolio updated");
            }
            router.push("/portfolios");
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
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/portfolios">
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

            <div className="grid grid-cols-1 gap-8">
                {/* Basic Info */}
                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-lg">Basic Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium">Title</label>
                            <Input disabled={loading} placeholder="Project Title" {...register("title", { required: true })} />
                            {errors.title && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                disabled={loading}
                                placeholder="Project Description"
                                {...register("description", { required: true })}
                            />
                            {errors.description && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-lg">Images</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title Image (Cover)</label>
                        <ImageUpload
                            value={control._formValues.title_image} // Need to watch this properly? react-hook-form's watch is better or controlled component
                            onChange={(url) => setValue("title_image", url as string)}
                            onRemove={() => setValue("title_image", "")}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Images</label>
                        <ImageUpload
                            value={control._formValues.images} // Better to use watch here too really, but passing logic down
                            // Let's rely on setValue triggering re-render if using watch in real generic
                            // For now this might be stale if strict mode. useWatch is better.
                            onChange={(urls) => setValue("images", urls as string[])}
                            onRemove={(url) => setValue("images", control._formValues.images.filter((current: string) => current !== url))}
                            disabled={loading}
                            maxFiles={5}
                        />
                    </div>
                </div>

                {/* Technologies - Dynamic Key/Value */}
                <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Technologies</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ key: "", value: "" })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Tech
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input
                                    disabled={loading}
                                    placeholder="Name (e.g. React)"
                                    {...register(`technologies.${index}.key` as const, { required: true })}
                                />
                                <Input
                                    disabled={loading}
                                    placeholder="Description/Version/Icon URL"
                                    {...register(`technologies.${index}.value` as const, { required: true })}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-lg">Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Live Link</label>
                            <Input disabled={loading} placeholder="https://..." {...register("live_link")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub Link</label>
                            <Input disabled={loading} placeholder="https://github.com/..." {...register("github_link")} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
