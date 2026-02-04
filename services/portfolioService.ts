import api from "@/lib/api";

export interface Portfolio {
    _id: string;
    title: string;
    description: string;
    title_image: string;
    images: string[];
    technologies: Record<string, string>;
    live_link?: string;
    github_link?: string;
    createdAt: string;
    updatedAt: string;
}

export const portfolioService = {
    getAll: async () => {
        const response = await api.get("/portfolios");
        // Assuming API returns { success: true, count: N, data: [...] } or just [...]
        // Adjust based on typical Express API structure. 
        // Usually responses are wrapped.
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/portfolios/${id}`);
        return response.data.data || response.data;
    },
    create: async (data: Partial<Portfolio>) => {
        const response = await api.post("/portfolios", data);
        return response.data;
    },
    update: async (id: string, data: Partial<Portfolio>) => {
        const response = await api.put(`/portfolios/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/portfolios/${id}`);
        return response.data;
    },
};
