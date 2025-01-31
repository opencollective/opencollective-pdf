import React from "react";
import express from "express";
import { StatusCodes } from "http-status-codes";
import EmptyPDF from "../components/EmptyPDF";
import { sendPDFResponse } from "../utils/pdf";

const router = express.Router();

router.get("/:id/:filename.pdf", async (req, res) => {
  const { id, filename } = req.params;

  if (!id || !filename) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID and filename are required",
    });
    return;
  }

  await sendPDFResponse(res, <EmptyPDF />);
});

export default router;
