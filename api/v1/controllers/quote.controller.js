import Quote from "../models/quote.model.js";
import User from "../models/user.model.js";
import paginate from "../helpers/paginate.js";

const controller = {
    /* [GET] api/v1/quotes - Lấy danh sách quotes */
    index: async (req, res) => {
        try {
            const { page, limit } = req.query;

            const result = await paginate(Quote, {}, page, limit, "createdBy");

            if(result.data.length > 0) {
                const populatedQuotes = await Promise.all(
                    result.data.map(async (quote) => {
                        if(quote.createdBy) {
                            quote.createdBy = await User.findById(quote.createdBy).select("-password");
                        }
                        return quote;
                    })
                );
                result.data = populatedQuotes;
            }

            res.status(200).json(result);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách quotes", error });
        }
    },

    /* [GET] api/v1/quotes/:id - Lấy chi tiết quote */
    detail: async (req, res) => {
        try {
            const { id } = req.params;

            const quote = await Quote.findById(id).populate("createdBy", "-password");

            if(!quote) {
                return res.status(404).json({ message: "Quote không tồn tại" });
            }

            res.status(200).json({ success: true, quote });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy quote", error });
        }
    },

    /* [POST] api/v1/quotes/create - Tạo quote mới */
    create: async (req, res) => {
        try {
            const { title, text, author, source, reflection } = req.body;
            const createdBy = req.user?.id || null;
            const today = new Date().toISOString().split("T")[0];
            const newQuote = new Quote({
                title,
                text,
                author,
                reflection,
                source,
                createdBy,
                date: today
            });

            const savedQuote = await newQuote.save();

            res.status(201).json({
                success: true,
                message: "Tạo quote thành công",
                quote: savedQuote,
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo quote", error });
        }
    },

    /* [PATCH] api/v1/quotes/:id/update - Cập nhật quote */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { text, author, source } = req.body;

            const updatedQuote = await Quote.findByIdAndUpdate(
                id,
                { text, author, source },
                { new: true }
            );

            if(!updatedQuote) {
                return res.status(404).json({ message: "Không tìm thấy quote" });
            }

            res.status(200).json({
                success: true,
                message: "Cập nhật quote thành công",
                quote: updatedQuote,
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi cập nhật quote", error });
        }
    },

    /* [DELETE] api/v1/quotes/:id/delete - Xóa quote */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const deletedQuote = await Quote.findByIdAndDelete(id);

            if(!deletedQuote) {
                return res.status(404).json({ message: "Không tìm thấy quote" });
            }

            res.status(200).json({ message: "Xóa quote thành công", quote: deletedQuote });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa quote", error });
        }
    },

    /* [GET] api/v1/quotes/random - Lấy Quote ngẫu nhiên mỗi ngày */
    getQuoteOfTheDay: async (req, res) => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            let quote = await Quote.findOne({
                $or: [
                    { lastUsed: { $exists: false } },
                    { lastUsed: { $lt: thirtyDaysAgo } }
                ]
            }).sort({ lastUsed: 1 });

            if(!quote) {
                quote = await Quote.findOne().sort({ lastUsed: 1 });
            }

            if(!quote) {
                return res.status(404).json({ message: "Không có quote nào trong database." });
            }
            quote.lastUsed = today;
            await quote.save();

            res.status(200).json({
                data: quote,
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy Quote of the Day", error });
        }
    },

    // [POST] api/v1/quotes/bulk-create - Thêm nhiều quotes cùng lúc
    createMultipleQuotes: async (req, res) => {
        try {
            const quotes = req.body;
            if(!Array.isArray(quotes) || quotes.length === 0) {
                return res.status(400).json({ message: "Danh sách quote không hợp lệ." });
            }
            const newQuotes = await Quote.insertMany(quotes);

            res.status(201).json({
                message: "Thêm nhiều quote thành công!",
                data: newQuotes
            });
        } catch(error) {
            res.status(500).json({
                message: "Lỗi khi thêm nhiều quote",
                error: error.message || error
            });
        }
    }
};

export default controller;
