import { supabase } from "../../../../config/supabase.js";

const BUCKET_NAME = "uploads";

export const uploadImageToSupabase = async (file) => {
    try {
        if (!file) throw new Error("Không có file");

        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        throw error;
    }
};

export const deleteImageFromSupabase = async (imageUrl) => {
    try {
        if (!imageUrl) return;

        const parts = imageUrl.split("/");
        const fileName = parts[parts.length - 1];

        const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        if (error) throw error;
    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        throw error;
    }
};
