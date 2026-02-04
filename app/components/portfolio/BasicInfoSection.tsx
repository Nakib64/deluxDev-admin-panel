"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

interface BasicInfoSectionProps {
    loading: boolean;
    register: UseFormRegister<any>; // Using any for simplicity in rapid refactor, ideally strict typed
    errors: FieldErrors<any>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ loading, register, errors }) => {
    return (
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
    );
};
