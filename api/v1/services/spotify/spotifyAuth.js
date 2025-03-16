import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SPOTIFY_AUTH_URL = process.env.SPOTIFY_AUTH_URL;

export const getAccessToken = async () => {
    try {
        const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

        const response = await axios.post(
            SPOTIFY_AUTH_URL,
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Spotify token", error);
        throw error;
    }
};
