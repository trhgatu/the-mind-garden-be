import express from "express";
import controller from "../../controllers/category.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", controller.index);
router.get("/:id", controller.detail);
router.post("/create", controller.create);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
