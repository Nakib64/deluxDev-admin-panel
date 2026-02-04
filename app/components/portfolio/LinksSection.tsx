"use client";

import { UseFormRegister } from "react-hook-form";
import { Input } from "@/app/components/ui/input";

interface LinksSectionProps {
    loading: boolean;
    register: UseFormRegister<any>;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ loading, register }) => {
    return (
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
    );
};
