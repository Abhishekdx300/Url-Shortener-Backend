import express from "express";
const router = express.Router();
import { ShortenUrl, redirect } from "../controllers/url.js";

router.route("/short").post(ShortenUrl);
// router.route("/:id").get(redirect);

export default router;
