import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();
import Urlmodel from "../models/Url.js";
import { validateUrl } from "../utils/utils.js";

export const ShortenUrl = async (req, res) => {
  const { mainUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid();

  if (validateUrl(mainUrl)) {
    try {
      let url = await Urlmodel.findOne({ mainUrl });
      if (url) {
        res.status(200).json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Urlmodel({
          mainUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });
        await url.save();
        res.status(201).json(url);
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json("Internal server error, please try again after some time.");
    }
  } else {
    res.status(400).json("Invalid main Url");
  }
};

export const redirect = async (req, res) => {
  try {
    const url = await Urlmodel.findOne({ urlId: req.params.id });
    if (url) {
      await Urlmodel.updateOne(
        { urlId: req.params.id },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.mainUrl);
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json("Internal server error, please try again after some time.");
  }
};
