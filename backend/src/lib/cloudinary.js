import {v2 as cloudinary } from "cloudinary"

import { config } from "dotenv";

config();

cloudinary.config({
    cloud_name: 'doujpmwwz',
    api_key: "755299932729148",
    api_secret: "qbGD6qVCANQExtF9p_bNKwsgOOA",
});
export default cloudinary;