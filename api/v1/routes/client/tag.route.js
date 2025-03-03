import express from "express";
import controller from "../../controllers/tag.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", controller.index);
router.get("/:id", controller.detail);
router.post("/create", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
