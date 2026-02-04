import api from "@/lib/api";

export interface Review {
    _id: string;
    author_name: string;
    country: string;
    rating: number;
    title_project: string;
    review: string;
    author_profile_image: string;
    createdAt: string;
    updatedAt: string;
}

export const reviewService = {
    getAll: async () => {
        const response = await api.get("/reviews");
        return response.data.data || response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/reviews/${id}`);
        return response.data.data || response.data;
    },
    create: async (data: Partial<Review>) => {
        const response = await api.post("/reviews", data);
        return response.data;
    },
    update: async (id: string, data: Partial<Review>) => {
        const response = await api.put(`/reviews/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    },
};
