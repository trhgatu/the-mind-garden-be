import { getUserPlaylists, getTrackInfo } from "../services/spotify/spotifyService.js";

export const fetchPlaylists = async (req, res) => {
    try {
        const { userId } = req.params;
        const playlists = await getUserPlaylists(userId);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: "Error fetching playlists" });
    }
};

export const fetchTrack = async (req, res) => {
    try {
        const { trackId } = req.params;
        const track = await getTrackInfo(trackId);
        res.json(track);
    } catch (error) {
        res.status(500).json({ message: "Error fetching track" });
    }
};
