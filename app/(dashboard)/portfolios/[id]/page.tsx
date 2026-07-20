"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { portfolioService } from "@/services/portfolioService";
import { techService, Tech } from "@/services/techService";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

// Imported Sections
import { BasicInfoSection } from "@/app/components/portfolio/BasicInfoSection";
import { ImagesSection } from "@/app/components/portfolio/ImagesSection";
import { TechnologiesSection } from "@/app/components/portfolio/TechnologiesSection";
import { LinksSection } from "@/app/components/portfolio/LinksSection";

interface PortfolioFormValues {
    title: string;
    description: string;
    title_zh: string;
    description_zh: string;
    title_image: string;
    images: { layout: "full" | "grid-2" | "grid-3" | "grid-4" | "flex"; urls: string[] }[];
    technologies: { name: string; image: string }[];
    live_link: string;
    github_link: string;
}

export default function PortfolioFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [availableTechs, setAvailableTechs] = useState<Tech[]>([]);

    const isNew = params.id === "new";
    const title = isNew ? "Create Portfolio" : "Edit Portfolio";
    const action = isNew ? "Create" : "Save changes";

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<PortfolioFormValues>({
        defaultValues: {
            title: "",
            description: "",
            title_zh: "",
            description_zh: "",
            title_image: "",
            images: [],
            technologies: [],
            live_link: "",
            github_link: "",
        },
    });

    useEffect(() => {
        // Fetch Available Techs
        setLoading(true);
        techService.getAll()
            .then(setAvailableTechs)
            .catch(() => toast.error("Failed to fetch tech stack"))
            .finally(() => setLoading(false));

        if (!isNew && params.id) {
            setLoading(true);
            portfolioService.getOne(params.id as string)
                .then((data) => {
                    setValue("title", data.title);
                    setValue("description", data.description);
                    setValue("title_zh", data.title_zh || "");
                    setValue("description_zh", data.description_zh || "");
                    setValue("title_image", data.title_image);
                    setValue("images", data.images || []);
                    setValue("live_link", data.live_link || "");
                    setValue("github_link", data.github_link || "");

                    if (data.technologies) {
                        setValue("technologies", data.technologies);
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

            // 1. Submit
            if (isNew) {
                await portfolioService.create(data);
                toast.success("Portfolio created");
            } else {
                await portfolioService.update(params.id as string, data);
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

                <BasicInfoSection
                    loading={loading}
                    register={register}
                    control={control}
                    errors={errors}
                />

                <ImagesSection
                    loading={loading}
                    setValue={setValue}
                    watch={watch}
                />

                <TechnologiesSection
                    loading={loading}
                    control={control}
                    register={register}
                    availableTechs={availableTechs}
                />

                <LinksSection
                    loading={loading}
                    register={register}
                />

            </div>
        </div>
    );
}
