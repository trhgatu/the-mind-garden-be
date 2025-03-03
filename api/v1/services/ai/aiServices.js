import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://api.together.xyz/v1/chat/completions";
const API_KEY = process.env.LLAMA_API_KEY;

export const generatePostContent = async (topic) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [
          {
            role: "user",
            content: `Viết một bài blog về chủ đề: "${topic}" với cú pháp markdown sử dụng trong React.
                      - Không xuống dòng bằng \n, chỉ xuống dòng thôi (enter)
                      - Viết ngắn gọn, súc tích
                      - Tránh việc tạo tiêu đề như "Kết luận" hoặc "Giới thiệu", hãy để nó tự nhiên hơn.
                      - Viết một bài blog đơn giản nhưng đầy đủ và mạch lạc, không quá dài.
                      - Xuống dòng hợp lý
                      - Nếu có trích dẫn, hãy xuống dòng,
                      - Thêm trích dẫn nếu có thể`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    return response.data.choices?.[0]?.message?.content || "Không có nội dung trả về";
  } catch(error) {
    console.error("Lỗi khi gọi Together AI:", error.response?.data || error.message);
    throw new Error("Không thể tạo bài viết");
  }
};
