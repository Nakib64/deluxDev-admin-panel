"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { BlogFormValues } from "./types";

interface BlogDescriptionProps {
    loading: boolean;
    name: "description" | "description_zh";
    label: string;
}

export default function BlogDescription({
    loading,
    name,
    label
}: BlogDescriptionProps) {
    const { control, register } = useFormContext<BlogFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });

    return (
        <div className="space-y-4 border p-4 rounded-md col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{label}</h3>
                <div className="space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ type: "heading", value: "" })}>
                        <Plus className="h-4 w-4 mr-2" /> Add Heading
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ type: "paragraph", value: "" })}>
                        <Plus className="h-4 w-4 mr-2" /> Add Paragraph
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start p-2 bg-slate-50 dark:bg-slate-900 rounded border">
                        <div className="w-[120px] pt-2">
                            <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${field.type === 'heading' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {field.type}
                            </span>
                            {/* Hidden input to register type */}
                            <input type="hidden" {...register(`${name}.${index}.type`)} defaultValue={field.type} />
                        </div>
                        <div className="flex-1">
                            <Textarea
                                rows={field.type === 'heading' ? 1 : 3}
                                disabled={loading}
                                placeholder={field.type === 'heading' ? (name === "description_zh" ? "标题" : "Heading Text") : (name === "description_zh" ? "内容..." : "Paragraph Content...")}
                                {...register(`${name}.${index}.value` as const, { required: true })}
                                className={field.type === 'heading' ? "font-bold text-lg" : ""}
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground text-sm border-dashed border-2 rounded-md">
                        No description sections added.
                    </div>
                )}
            </div>
        </div>
    );
}
