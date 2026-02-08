import api from "@/lib/api";

export interface Tech {
    _id: string;
    name: string;
    icon: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export const techService = {
    getAll: async () => {
        const response = await api.get("/tech");
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/tech/${id}`);
        return response.data.data || response.data;
    },
    create: async (data: Partial<Tech>) => {
        const response = await api.post("/tech", data);
        return response.data;
    },
    update: async (id: string, data: Partial<Tech>) => {
        const response = await api.put(`/tech/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/tech/${id}`);
        return response.data;
    },
};
