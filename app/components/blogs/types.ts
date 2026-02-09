import { BlogDescSection } from "@/services/blogService";

export interface BlogFormValues {
    title: string;
    title_zh: string;
    title_animation: string;
    cover_image: string;
    description: BlogDescSection[];
    description_zh: BlogDescSection[];
    author_name: string;
    author_profile_image: string;
    slug: string;
}
