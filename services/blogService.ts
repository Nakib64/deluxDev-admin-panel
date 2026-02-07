import api from "@/lib/api";

export interface Blog {
    _id: string;
    title: string;
    title_animation: any; // Object for Lottie
    cover_image: string;
    description: Record<string, string>;
    author_details: {
        name: string;
        profile_image: string;
    };
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export const blogService = {
    getAll: async () => {
        const response = await api.get("/blogs");
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/blogs/${id}`);
        return response.data.data || response.data;
    },
    create: async (formData: FormData) => {
        const response = await api.post("/blogs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
    update: async (id: string, formData: FormData) => {
        const response = await api.put(`/blogs/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    },
};
