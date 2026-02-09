import api from "@/lib/api";

export interface BlogDescSection {
    type: "heading" | "paragraph";
    value: string;
}

export interface Blog {
    _id: string;
    title: {
        en: string;
        zh: string;
    };
    title_animation: string;
    cover_image: string;
    description: {
        en: BlogDescSection[];
        zh: BlogDescSection[];
    };
    author: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

export const blogService = {
    getAll: async () => {
        const response = await api.get("/blogs");
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        // Request raw data for editing (admin panel)
        const response = await api.get(`/blogs/${id}?raw=true`);
        return response.data.data || response.data;
    },
    create: async (data: Partial<Blog>) => {
        const response = await api.post("/blogs", data);
        return response.data;
    },
    update: async (id: string, data: Partial<Blog>) => {
        const response = await api.put(`/blogs/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    },
};
