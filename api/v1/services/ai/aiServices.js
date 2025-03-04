import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://api.together.xyz/v1/chat/completions";
const API_KEY = process.env.LLAMA_API_KEY;

if(!API_KEY) {
  console.error("⚠️ Lỗi: API_KEY không được tìm thấy. Kiểm tra file .env");
  process.exit(1);
}

/**
 * Gọi Together AI để generate bài viết markdown
 * @param {string} topic Chủ đề bài viết
 * @returns {Promise<string>} Nội dung bài viết dạng markdown
 */
export const generatePostContent = async (topic) => {
  if(!topic) {
    throw new Error("Chủ đề không được để trống");
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [
          {
            role: "user",
            content: `Hãy viết một bài blog về chủ đề: "${topic}" theo phong cách gần gũi, tự nhiên như một người đang chia sẻ suy nghĩ và cảm xúc cá nhân.
          - Viết một cách **tự nhiên, có chiều sâu**, có thể mang phong cách **nhẹ nhàng, suy tư**, hoặc **hóm hỉnh, hài hước**, hoặc **sâu sắc, hoài niệm** tùy theo chủ đề.
          - Tránh sử dụng các tiêu đề cứng nhắc như "Tìm kiếm hạnh phúc" hay "Ý nghĩa cuộc sống".
          - Viết như đang kể chuyện, có thể xen kẽ cảm xúc cá nhân, một kỷ niệm hoặc một trải nghiệm thực tế.
          - Nếu đã nhắc đến một quan điểm, không cần nhắc lại quá nhiều lần. Hãy để mỗi đoạn mang đến một ý tưởng mới.
          - Có thể thử nghiệm với nhiều hình thức: **tản văn, thư gửi ai đó, hồi ký cá nhân, một đoạn đối thoại hoặc một câu chuyện nhỏ.**
          - Nếu phù hợp, có thể thêm một đoạn thơ hoặc một câu nói hay mà không cần gượng ép.
          - Nếu có trích dẫn một câu nói hay, hãy **ghi rõ tên tác giả nếu có thể**.
          - Tránh việc nhấn mạnh một ý quá nhiều lần, hãy để cảm xúc dẫn dắt tự nhiên.
          - Viết có chiều sâu, tránh việc liệt kê hoặc phân tích quá lý trí.
          - Kết bài một cách nhẹ nhàng, có thể mở ra một câu hỏi hoặc để lại một chút dư vị cho người đọc.
          - Độ dài khoảng **300-500 từ**, không quá dài nhưng đủ ý nghĩa.
          - Nếu có thơ hoặc trích dẫn, hãy xuống dòng hợp lý, dùng Markdown đúng cách.
          - Viết như một đoạn văn trong một cuốn sách đầy cảm xúc.
          - Kết thúc bài viết bằng một câu nói hay, tạo động lực.`
            ,

          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    // Kiểm tra response
    if(!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error("Không có nội dung trả về từ AI.");
    }

    return response.data.choices[0].message?.content || "Không có nội dung trả về";
  } catch(error) {
    console.error("❌ Lỗi khi gọi Together AI:", error.response?.data || error.message);
    throw new Error("Không thể tạo bài viết từ AI.");
  }
};
