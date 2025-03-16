import express from "express";
import { fetchPlaylists, fetchTrack } from "../../controllers/spotify.controller.js";

const router = express.Router();

router.get("/playlists/:userId", fetchPlaylists);
router.get("/track/:trackId", fetchTrack);

export default router;
