import express from 'express';
import controller from '../../controllers/post.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     description: Trả về danh sách tất cả bài viết.
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', controller.index);
router.post('/create', authMiddleware, controller.create)

export default router;
