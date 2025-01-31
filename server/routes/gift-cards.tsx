import React from "react";
import express from "express";
import { sendPDFResponse } from "../utils/pdf.ts";
import GiftCardsPage from "../components/gift-cards/GiftCardsPage.tsx";

const router = express.Router();

const getCardsFromBody = async (req) => {
  if (req.method === "POST") {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (data) => {
        body += data;

        // Too much POST data, kill the connection!
        // 1e7 === 1 * Math.pow(10, 7) === 1 * 10000000 ~~~ 10MB
        if (body.length > 1e6) {
          reject(req.connection.destroy());
        }
      });

      req.on("end", () => {
        resolve(JSON.parse(body)?.cards);
      });
    });
  } else if (req.query.cards) {
    return JSON.parse(req.query.cards);
  }
};

router.get(
  "/:filename.pdf",
  async (req: express.Request, res: express.Response) => {
    const { filename } = req.params;
    if (!filename) {
      res.status(400).json({ message: "Filename is required" });
      return;
    }

    const cards = await getCardsFromBody(req);
    await sendPDFResponse(res, <GiftCardsPage cards={cards} />);
  }
);

export default router;
