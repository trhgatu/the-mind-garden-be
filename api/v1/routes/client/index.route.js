import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import aiRoutes from "./ai.route.js";
import tagRoutes from "./tag.route.js";
import userRoutes from "./user.route.js";
import categoryRoutes from "./category.route.js";
import quoteRoutes from "./quote.route.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const clientRouter = (app) => {
    const version = "/api/v1";

    // Routes cho user
    app.use(version + "/posts", postRoutes);
    app.use(version + "/categories", categoryRoutes);
    app.use(version + "/quotes", quoteRoutes)
    app.use(version + "/users", userRoutes)
    app.use(version + "/auth", authRoutes);
    app.use(version + "/ai", aiRoutes);
    app.use(version + "/tags", tagRoutes);
};

export default clientRouter;
