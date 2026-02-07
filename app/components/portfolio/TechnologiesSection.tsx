"use client";

import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface TechnologiesSectionProps {
    loading: boolean;
    control: Control<any>;
    register: UseFormRegister<any>;
    availableTechs: { name: string; icon: string }[];
}

export const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({
    loading,
    control,
    register,
    availableTechs
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "technologies",
    });

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Technologies</h3>
                <div className="flex gap-2 flex-wrap max-w-md">
                    {availableTechs.map((tech) => {
                        const isSelected = fields.some(f => (f as any).name === tech.name);
                        return (
                            <Button
                                key={tech.name}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                disabled={loading}
                                onClick={() => {
                                    if (isSelected) {
                                        const index = fields.findIndex(f => (f as any).name === tech.name);
                                        remove(index);
                                    } else {
                                        append({ name: tech.name, image: tech.icon });
                                    }
                                }}
                            >
                                <img src={tech.icon} alt={tech.name} className="h-4 w-4 mr-2 object-contain" />
                                {tech.name}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t">
                {fields.length === 0 && <p className="text-sm text-muted-foreground">No technologies selected.</p>}
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md border">
                        <img src={(field as any).image} alt={(field as any).name} className="h-5 w-5 object-contain" />
                        <span className="text-sm font-medium">{(field as any).name}</span>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => remove(index)}
                        >
                            <Trash className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
