import express from 'express';
import controller from '../../controllers/post.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', controller.index);
router.post('/create', controller.create); //authMiddleware
router.get("/:slug", controller.detail);
router.patch("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);
export default router;
