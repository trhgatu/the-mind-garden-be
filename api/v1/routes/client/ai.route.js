import express from "express";
import controller from '../../controllers/ai.controller.js';

const router = express.Router();

router.post("/generate", controller.generatePost);

export default router;
