"use client";

import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface TechnologiesSectionProps {
    loading: boolean;
    control: Control<any>;
    register: UseFormRegister<any>;
}

export const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ loading, control, register }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "technologies",
    });

    return (
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
    );
};
