import api from "@/lib/api";

export const uploadFile = async (file: File, folder?: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
        formData.append("folder", folder);
    }

    // We post to the backend, which puts it in Cloudinary and returns URL
    const response = await api.post("/cloudinary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url || response.data.secure_url || response.data;
};
