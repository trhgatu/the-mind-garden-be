import express from 'express';
import controller from '../../controllers/post.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../../middlewares/uploadCloud.middleware.js';
const router = express.Router();

router.get('/', controller.index);
router.post('/create', uploadSingleImage, controller.create); //authMiddleware
router.get("/:slug", controller.detail);
router.put("/:id", controller.update);
router.delete("/soft-delete/:id", controller.delete);
router.delete("/hard-delete/:id", controller.hardDelete);

export default router;
