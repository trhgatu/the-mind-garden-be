import express from 'express';
import controller from '../../controllers/quote.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get("/get-qotd", controller.getQuoteOfTheDay)

router.get('/', controller.index);
router.post('/create', controller.create); //authMiddleware
router.get("/:id", controller.detail); //authMiddleware
router.patch("/:id", controller.update);//authMiddleware
router.delete("/:id",  controller.delete);//authMiddleware


export default router;
