import api from "@/lib/api";

export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export const categoryService = {
    getAll: async () => {
        const response = await api.get("/categories");
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/categories/${id}`);
        return response.data.data || response.data;
    },
    create: async (data: { name: string }) => {
        const response = await api.post("/categories", data);
        return response.data;
    },
    update: async (id: string, data: { name: string }) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};
